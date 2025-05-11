from datetime import datetime, timedelta
import pytz
from models import TimeEntry
from app import db

def get_current_time_in_timezone(timezone_str):
    """Get the current time in the specified timezone"""
    try:
        if not timezone_str:
            timezone_str = 'UTC'
        timezone = pytz.timezone(timezone_str)
        return datetime.now(timezone)
    except Exception as e:
        import logging
        logging.error(f"Error getting current time in timezone {timezone_str}: {str(e)}")
        # Return UTC time as fallback
        return datetime.now(pytz.UTC)

def convert_timezone(dt, from_tz, to_tz):
    """Convert a datetime from one timezone to another"""
    # If dt doesn't have tzinfo, assume it's in from_tz
    if dt.tzinfo is None:
        source_tz = pytz.timezone(from_tz)
        dt = source_tz.localize(dt)
    
    # Convert to target timezone
    target_tz = pytz.timezone(to_tz)
    return dt.astimezone(target_tz)

def calculate_duration_seconds(start_time, end_time=None):
    """Calculate duration between start and end time in seconds"""
    if end_time is None:
        end_time = datetime.utcnow()
    
    # Ensure both times are timezone-aware or naive
    if start_time.tzinfo is not None and end_time.tzinfo is None:
        end_time = pytz.UTC.localize(end_time)
    elif start_time.tzinfo is None and end_time.tzinfo is not None:
        start_time = pytz.UTC.localize(start_time)
    
    return int((end_time - start_time).total_seconds())

def parse_duration_string(duration_str):
    """Parse a duration string in HH:MM:SS format to seconds"""
    try:
        parts = duration_str.split(':')
        if len(parts) == 3:
            hours, minutes, seconds = parts
            return int(hours) * 3600 + int(minutes) * 60 + int(seconds)
        return 0
    except:
        return 0

def format_duration(seconds):
    """Format seconds to HH:MM:SS"""
    hours, remainder = divmod(seconds, 3600)
    minutes, seconds = divmod(remainder, 60)
    return f"{hours:02d}:{minutes:02d}:{seconds:02d}"

def get_all_timezones():
    """Return a list of all timezone choices"""
    return [(tz, tz) for tz in pytz.common_timezones]

def start_timer(user_id, project_id, task_id=None, description=None):
    """Start a new timer for the user"""
    # Check if user has any running timers
    running_entry = TimeEntry.query.filter_by(
        user_id=user_id, 
        status='running'
    ).first()
    
    if running_entry:
        # Stop existing timer
        running_entry.end_time = datetime.utcnow()
        running_entry.duration = calculate_duration_seconds(running_entry.start_time, running_entry.end_time)
        running_entry.status = 'completed'
    
    # Create new timer
    new_entry = TimeEntry()
    new_entry.user_id = user_id
    new_entry.project_id = project_id
    new_entry.task_id = task_id
    new_entry.description = description
    new_entry.start_time = datetime.utcnow()
    new_entry.status = 'running'
    
    db.session.add(new_entry)
    db.session.commit()
    return new_entry

def pause_timer(time_entry_id):
    """Pause a running timer"""
    entry = TimeEntry.query.get(time_entry_id)
    if entry and entry.status == 'running':
        current_duration = calculate_duration_seconds(entry.start_time, datetime.utcnow())
        entry.duration = current_duration
        entry.status = 'paused'
        db.session.commit()
    return entry

def resume_timer(time_entry_id):
    """Resume a paused timer"""
    entry = TimeEntry.query.get(time_entry_id)
    if entry and entry.status == 'paused':
        # Store existing duration
        existing_duration = entry.duration or 0
        
        # Set new start time (now - existing duration)
        entry.start_time = datetime.utcnow() - timedelta(seconds=existing_duration)
        entry.status = 'running'
        db.session.commit()
    return entry

def stop_timer(time_entry_id):
    """Stop a timer (mark as completed)"""
    entry = TimeEntry.query.get(time_entry_id)
    if entry and (entry.status == 'running' or entry.status == 'paused'):
        if entry.status == 'running':
            entry.end_time = datetime.utcnow()
            entry.duration = calculate_duration_seconds(entry.start_time, entry.end_time)
        entry.status = 'completed'
        db.session.commit()
    return entry

def get_weekly_stats(user_id):
    """Get weekly time tracking stats for visualization"""
    try:
        now = datetime.utcnow()
        start_of_week = now - timedelta(days=now.weekday())
        start_of_week = start_of_week.replace(hour=0, minute=0, second=0, microsecond=0)
        
        days = []
        day_labels = []
        daily_hours = []
        
        for i in range(7):
            day = start_of_week + timedelta(days=i)
            next_day = day + timedelta(days=1)
            day_label = day.strftime('%a')
            
            # Get time entries for this day
            entries = TimeEntry.query.filter(
                TimeEntry.user_id == user_id,
                TimeEntry.start_time >= day,
                TimeEntry.start_time < next_day
            ).all()
            
            # Calculate total duration
            total_duration = 0
            for entry in entries:
                # Check if entry has the is_running property (method)
                # and access it directly if possible
                if hasattr(entry, 'status') and entry.status == 'running':
                    # Still running, calculate duration up to now
                    duration = calculate_duration_seconds(entry.start_time)
                elif hasattr(entry, 'status') and entry.status == 'paused':
                    # Use the stored duration
                    duration = entry.duration or 0
                else:
                    # Completed entry
                    duration = entry.duration or calculate_duration_seconds(entry.start_time, entry.end_time)
                total_duration += duration
            
            # Convert seconds to hours
            hours = round(total_duration / 3600, 1)
            
            days.append(day.strftime('%Y-%m-%d'))
            day_labels.append(day_label)
            daily_hours.append(hours)
        
        # Return values as simple types, not methods
        return {
            'days': list(days),
            'labels': list(day_labels),
            'values': list(daily_hours)
        }
    except Exception as e:
        import logging
        logging.error(f"Error in get_weekly_stats: {str(e)}")
        # Return empty data
        return {
            'days': [],
            'labels': [],
            'values': []
        }

def get_project_stats(user_id):
    """Get project time tracking stats for visualization"""
    try:
        # Get all completed time entries for this user
        entries = TimeEntry.query.filter(
            TimeEntry.user_id == user_id,
            TimeEntry.status == 'completed'
        ).all()
        
        # Aggregate times by project
        project_times = {}
        for entry in entries:
            project_id = entry.project_id
            project_name = entry.project.name
            duration = entry.duration or 0
            
            if project_id not in project_times:
                project_times[project_id] = {
                    'name': project_name,
                    'duration': 0,
                    'color': entry.project.color if hasattr(entry.project, 'color') and entry.project.color else '#6c757d'
                }
            
            project_times[project_id]['duration'] += duration
        
        # Prepare data for chart
        project_names = []
        project_durations = []
        project_colors = []
        
        for project_id, data in project_times.items():
            project_names.append(str(data['name']))
            # Convert seconds to hours
            project_durations.append(float(round(data['duration'] / 3600, 1)))
            project_colors.append(str(data['color']))
        
        # Return values explicitly as simple types, not methods
        return {
            'labels': list(project_names),
            'values': list(project_durations),
            'colors': list(project_colors)
        }
    except Exception as e:
        import logging
        logging.error(f"Error in get_project_stats: {str(e)}")
        # Return empty data
        return {
            'labels': [],
            'values': [],
            'colors': []
        }
