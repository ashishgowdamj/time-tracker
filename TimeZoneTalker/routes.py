from datetime import datetime, timedelta
import pytz
from flask import render_template, redirect, url_for, flash, request, jsonify
from flask_login import login_user, logout_user, login_required, current_user
from urllib.parse import urlparse
from app import app, db
from models import User, Project, Task, TimeEntry
from forms import (
    LoginForm, RegisterForm, ProjectForm, TaskForm, 
    TimeEntryForm, TimeEntryEditForm, TimezoneConverterForm
)
from utils import (
    get_current_time_in_timezone, convert_timezone, 
    start_timer, pause_timer, resume_timer, stop_timer,
    get_weekly_stats, get_project_stats, parse_duration_string
)

@app.route('/')
def index():
    try:
        if current_user.is_authenticated:
            # Prevent potential redirect loop by checking for errors
            try:
                # Get user timezone to test if user data is valid
                user_tz = current_user.timezone
                if not user_tz:
                    app.logger.error("User has no timezone set")
                    return render_template('index.html', error="Please log in again")
                return redirect(url_for('dashboard'))
            except Exception as e:
                app.logger.error(f"Error in index redirect: {str(e)}")
                logout_user()  # Force logout if user data is invalid
                flash("Session expired. Please log in again.", "warning")
                return render_template('index.html')
        return render_template('index.html')
    except Exception as e:
        app.logger.error(f"Unexpected error in index: {str(e)}")
        return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    try:
        if current_user.is_authenticated:
            return redirect(url_for('index'))
        
        if form.validate_on_submit():
            try:
                app.logger.debug(f"Attempting login for username: {form.username.data}")
                user = User.query.filter_by(username=form.username.data).first()
                
                if user is None:
                    app.logger.debug("User not found")
                    flash('Invalid username or password', 'danger')
                    return render_template('login.html', form=form)
                    
                app.logger.debug("User found, checking password")
                password_check = user.check_password(form.password.data)
                app.logger.debug(f"Password check result: {password_check}")
                
                if not password_check:
                    flash('Invalid username or password', 'danger')
                    return render_template('login.html', form=form)
                
                app.logger.debug("Password correct, logging user in")
                login_user(user)
                next_page = request.args.get('next')
                if not next_page or urlparse(next_page).netloc != '':
                    next_page = url_for('index')  # Use index to avoid direct dashboard redirect
                app.logger.debug(f"Redirecting to: {next_page}")
                return redirect(next_page)
            except Exception as e:
                app.logger.error(f"Login error: {str(e)}")
                flash('An error occurred during login. Please try again.', 'danger')
                return render_template('login.html', form=form)
    except Exception as e:
        app.logger.error(f"Unexpected error in login view: {str(e)}")
        flash('An unexpected error occurred. Please try again.', 'danger')
    
    return render_template('login.html', form=form)

@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    
    form = RegisterForm()
    if form.validate_on_submit():
        # Check if username or email already exists
        if User.query.filter_by(username=form.username.data).first():
            flash('Username already exists', 'danger')
            return redirect(url_for('register'))
        
        if User.query.filter_by(email=form.email.data).first():
            flash('Email already exists', 'danger')
            return redirect(url_for('register'))
        
        user = User()
        user.username = form.username.data
        user.email = form.email.data
        user.timezone = form.timezone.data
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        
        flash('Registration successful! You can now login.', 'success')
        return redirect(url_for('login'))
    
    return render_template('register.html', form=form)

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))

@app.route('/dashboard')
@login_required
def dashboard():
    try:
        app.logger.debug("Entering dashboard view for user ID: " + str(current_user.id))
        
        # Get current time in user's timezone
        user_tz = current_user.timezone
        app.logger.debug(f"User timezone: {user_tz}")
        current_time = get_current_time_in_timezone(user_tz)
        
        # Get active time entry (if any)
        active_entry = TimeEntry.query.filter_by(
            user_id=current_user.id, 
            status='running'
        ).first()
        app.logger.debug(f"Active entry: {active_entry}")
        
        # Get recent time entries
        recent_entries = TimeEntry.query.filter_by(
            user_id=current_user.id
        ).order_by(TimeEntry.created_at.desc()).limit(5).all()
        app.logger.debug(f"Recent entries count: {len(recent_entries)}")
        
        # Get weekly stats and project stats (with error handling)
        try:
            weekly_stats = get_weekly_stats(current_user.id)
        except Exception as e:
            app.logger.error(f"Error getting weekly stats: {str(e)}")
            weekly_stats = {"days": [], "labels": [], "values": []}
            
        try:
            project_stats = get_project_stats(current_user.id)
        except Exception as e:
            app.logger.error(f"Error getting project stats: {str(e)}")
            project_stats = {"labels": [], "values": [], "colors": []}
        
        # Prepare timer form
        timer_form = TimeEntryForm()
        
        # Get user projects
        user_projects = Project.query.filter_by(user_id=current_user.id).all()
        app.logger.debug(f"User projects count: {len(user_projects)}")
        
        timer_form.project_id.choices = [
            (p.id, p.name) for p in user_projects
        ]
        
        # Handle empty project list
        if timer_form.project_id.choices:
            app.logger.debug("User has projects, setting up choices")
            if active_entry:
                timer_form.project_id.default = active_entry.project_id
                timer_form.task_id.choices = [
                    (t.id, t.name) for t in Task.query.filter_by(project_id=active_entry.project_id).all()
                ]
                if active_entry.task_id:
                    timer_form.task_id.default = active_entry.task_id
                if active_entry.description:
                    timer_form.description.data = active_entry.description
            elif timer_form.project_id.choices:
                default_project_id = timer_form.project_id.choices[0][0]
                timer_form.task_id.choices = [
                    (t.id, t.name) for t in Task.query.filter_by(project_id=default_project_id).all()
                ]
        else:
            app.logger.debug("User has no projects")
            timer_form.task_id.choices = []
        
        timer_form.process()  # This processes the defaults
        
        app.logger.debug("Rendering dashboard template")
        return render_template(
            'dashboard.html',
            current_time=current_time,
            active_entry=active_entry,
            recent_entries=recent_entries,
            weekly_stats=weekly_stats,
            project_stats=project_stats,
            timer_form=timer_form
        )
    except Exception as e:
        app.logger.error(f"Dashboard error: {str(e)}")
        flash('An error occurred while loading the dashboard. Please try again.', 'danger')
        # Prevent redirect loop by sending to a simple page
        return render_template('error.html', message="Error loading dashboard. Try again later.")

@app.route('/projects', methods=['GET', 'POST'])
@login_required
def projects():
    form = ProjectForm()
    
    if form.validate_on_submit():
        project = Project()
        project.name = form.name.data
        project.description = form.description.data
        project.color = form.color.data
        project.user_id = current_user.id
        db.session.add(project)
        db.session.commit()
        flash('Project created successfully', 'success')
        return redirect(url_for('projects'))
    
    projects = Project.query.filter_by(user_id=current_user.id).all()
    return render_template('projects.html', form=form, projects=projects)

@app.route('/project/<int:project_id>/edit', methods=['GET', 'POST'])
@login_required
def edit_project(project_id):
    project = Project.query.filter_by(id=project_id, user_id=current_user.id).first_or_404()
    form = ProjectForm(obj=project)
    
    if form.validate_on_submit():
        project.name = form.name.data
        project.description = form.description.data
        project.color = form.color.data
        db.session.commit()
        flash('Project updated successfully', 'success')
        return redirect(url_for('projects'))
    
    return render_template('projects.html', form=form, edit_mode=True, projects=Project.query.filter_by(user_id=current_user.id).all())

@app.route('/project/<int:project_id>/delete', methods=['POST'])
@login_required
def delete_project(project_id):
    project = Project.query.filter_by(id=project_id, user_id=current_user.id).first_or_404()
    db.session.delete(project)
    db.session.commit()
    flash('Project deleted successfully', 'success')
    return redirect(url_for('projects'))

@app.route('/tasks', methods=['GET', 'POST'])
@login_required
def tasks():
    form = TaskForm()
    form.project_id.choices = [
        (p.id, p.name) for p in Project.query.filter_by(user_id=current_user.id).all()
    ]
    
    if form.validate_on_submit():
        # Verify project belongs to user
        project = Project.query.filter_by(id=form.project_id.data, user_id=current_user.id).first()
        if not project:
            flash('Invalid project selected', 'danger')
            return redirect(url_for('tasks'))
            
        task = Task()
        task.name = form.name.data
        task.description = form.description.data
        task.project_id = form.project_id.data
        db.session.add(task)
        db.session.commit()
        flash('Task created successfully', 'success')
        return redirect(url_for('tasks'))
    
    # Get tasks with project information
    tasks = Task.query.join(Project).filter(Project.user_id == current_user.id).all()
    return render_template('tasks.html', form=form, tasks=tasks)

@app.route('/task/<int:task_id>/edit', methods=['GET', 'POST'])
@login_required
def edit_task(task_id):
    task = Task.query.join(Project).filter(Task.id == task_id, Project.user_id == current_user.id).first_or_404()
    form = TaskForm(obj=task)
    form.project_id.choices = [
        (p.id, p.name) for p in Project.query.filter_by(user_id=current_user.id).all()
    ]
    
    if form.validate_on_submit():
        # Verify project belongs to user
        project = Project.query.filter_by(id=form.project_id.data, user_id=current_user.id).first()
        if not project:
            flash('Invalid project selected', 'danger')
            return redirect(url_for('tasks'))
            
        task.name = form.name.data
        task.description = form.description.data
        task.project_id = form.project_id.data
        db.session.commit()
        flash('Task updated successfully', 'success')
        return redirect(url_for('tasks'))
    
    tasks = Task.query.join(Project).filter(Project.user_id == current_user.id).all()
    return render_template('tasks.html', form=form, edit_mode=True, tasks=tasks)

@app.route('/task/<int:task_id>/delete', methods=['POST'])
@login_required
def delete_task(task_id):
    task = Task.query.join(Project).filter(Task.id == task_id, Project.user_id == current_user.id).first_or_404()
    db.session.delete(task)
    db.session.commit()
    flash('Task deleted successfully', 'success')
    return redirect(url_for('tasks'))

@app.route('/time-entries')
@login_required
def time_entries():
    entries = TimeEntry.query.filter_by(user_id=current_user.id).order_by(TimeEntry.start_time.desc()).all()
    return render_template('time_entries.html', entries=entries)

@app.route('/time-entry/<int:entry_id>/edit', methods=['GET', 'POST'])
@login_required
def edit_time_entry(entry_id):
    entry = TimeEntry.query.filter_by(id=entry_id, user_id=current_user.id).first_or_404()
    form = TimeEntryEditForm(obj=entry)
    form.project_id.choices = [
        (p.id, p.name) for p in Project.query.filter_by(user_id=current_user.id).all()
    ]
    
    # Set task choices based on project
    form.task_id.choices = [
        (t.id, t.name) for t in Task.query.filter_by(project_id=entry.project_id).all()
    ]
    form.task_id.choices.insert(0, (0, 'No Task'))
    
    # Set duration field
    if entry.duration:
        form.duration.data = entry.formatted_duration
    
    if form.validate_on_submit():
        # Verify project belongs to user
        project = Project.query.filter_by(id=form.project_id.data, user_id=current_user.id).first()
        if not project:
            flash('Invalid project selected', 'danger')
            return redirect(url_for('time_entries'))
        
        entry.project_id = form.project_id.data
        entry.task_id = form.task_id.data if form.task_id.data != 0 else None
        entry.description = form.description.data
        entry.status = form.status.data
        
        # Parse duration
        duration_seconds = parse_duration_string(form.duration.data)
        if duration_seconds > 0:
            entry.duration = duration_seconds
            # If completed, calculate end time based on start and duration
            if entry.status == 'completed' and entry.start_time:
                entry.end_time = entry.start_time + timedelta(seconds=duration_seconds)
        
        db.session.commit()
        flash('Time entry updated successfully', 'success')
        return redirect(url_for('time_entries'))
    
    return render_template('time_entries.html', form=form, edit_mode=True, entry_id=entry_id, entries=TimeEntry.query.filter_by(user_id=current_user.id).order_by(TimeEntry.start_time.desc()).all())

@app.route('/time-entry/<int:entry_id>/delete', methods=['POST'])
@login_required
def delete_time_entry(entry_id):
    entry = TimeEntry.query.filter_by(id=entry_id, user_id=current_user.id).first_or_404()
    db.session.delete(entry)
    db.session.commit()
    flash('Time entry deleted successfully', 'success')
    return redirect(url_for('time_entries'))

@app.route('/timer/start', methods=['POST'])
@login_required
def timer_start():
    form = TimeEntryForm()
    form.project_id.choices = [
        (p.id, p.name) for p in Project.query.filter_by(user_id=current_user.id).all()
    ]
    
    if form.validate_on_submit():
        # Verify project belongs to user
        project = Project.query.filter_by(id=form.project_id.data, user_id=current_user.id).first()
        if not project:
            flash('Invalid project selected', 'danger')
            return redirect(url_for('dashboard'))
        
        # Check if task belongs to project if task is provided
        task_id = form.task_id.data if form.task_id.data else None
        if task_id:
            task = Task.query.filter_by(id=task_id, project_id=form.project_id.data).first()
            if not task:
                task_id = None
        
        entry = start_timer(
            user_id=current_user.id,
            project_id=form.project_id.data,
            task_id=task_id,
            description=form.description.data
        )
        
        flash('Timer started', 'success')
    else:
        flash('Invalid form data', 'danger')
    
    return redirect(url_for('dashboard'))

@app.route('/timer/<int:entry_id>/pause', methods=['POST'])
@login_required
def timer_pause(entry_id):
    entry = TimeEntry.query.filter_by(id=entry_id, user_id=current_user.id).first_or_404()
    
    if entry.status == 'running':
        pause_timer(entry_id)
        flash('Timer paused', 'info')
    else:
        flash('Timer is not running', 'warning')
    
    return redirect(url_for('dashboard'))

@app.route('/timer/<int:entry_id>/resume', methods=['POST'])
@login_required
def timer_resume(entry_id):
    entry = TimeEntry.query.filter_by(id=entry_id, user_id=current_user.id).first_or_404()
    
    if entry.status == 'paused':
        resume_timer(entry_id)
        flash('Timer resumed', 'success')
    else:
        flash('Timer is not paused', 'warning')
    
    return redirect(url_for('dashboard'))

@app.route('/timer/<int:entry_id>/stop', methods=['POST'])
@login_required
def timer_stop(entry_id):
    entry = TimeEntry.query.filter_by(id=entry_id, user_id=current_user.id).first_or_404()
    
    if entry.status in ['running', 'paused']:
        stop_timer(entry_id)
        flash('Timer stopped', 'success')
    else:
        flash('Timer is already completed', 'warning')
    
    return redirect(url_for('dashboard'))

@app.route('/timezone-converter', methods=['GET', 'POST'])
@login_required
def timezone_converter():
    form = TimezoneConverterForm()
    result = None
    
    if form.validate_on_submit():
        try:
            # Parse input datetime
            dt_str = form.date_time.data
            if dt_str:
                dt = datetime.strptime(dt_str, '%Y-%m-%d %H:%M')
                
                # Set source timezone
                source_tz = form.source_timezone.data
                target_tz = form.target_timezone.data
                
                # Convert time
                converted_dt = convert_timezone(dt, source_tz, target_tz)
                
                result = {
                    'original': dt.strftime('%Y-%m-%d %H:%M'),
                    'original_tz': source_tz,
                    'converted': converted_dt.strftime('%Y-%m-%d %H:%M'),
                    'converted_tz': target_tz
                }
            else:
                flash('Please enter a date and time', 'warning')
            
        except Exception as e:
            app.logger.error(f'Timezone conversion error: {str(e)}')
            flash('Error converting time. Please check the format (YYYY-MM-DD HH:MM)', 'danger')
    
    return render_template('timezone_converter.html', form=form, result=result)

@app.route('/reports')
@login_required
def reports():
    """Show time tracking reports and statistics."""
    # Default empty stats
    weekly_stats = {"labels": [], "values": []}
    project_stats = {"labels": [], "values": [], "colors": []}
    entries = []
    project_totals = {}
    
    try:
        # Try to get weekly stats
        try:
            weekly_stats = get_weekly_stats(current_user.id)
        except Exception as e:
            app.logger.error(f"Error getting weekly stats: {str(e)}")
            
        # Try to get project stats
        try:
            project_stats = get_project_stats(current_user.id)
        except Exception as e:
            app.logger.error(f"Error getting project stats: {str(e)}")
            
        # Get time entries for the last 30 days
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        entries = TimeEntry.query.filter(
            TimeEntry.user_id == current_user.id,
            TimeEntry.start_time >= thirty_days_ago
        ).order_by(TimeEntry.start_time.desc()).all()
        
        # Calculate total time by project
        project_totals = {}
        for entry in entries:
            project_id = entry.project_id
            project_name = entry.project.name
            
            if project_id not in project_totals:
                project_totals[project_id] = {
                    'name': project_name,
                    'total_seconds': 0,
                    'color': entry.project.color
                }
            
            if hasattr(entry, 'is_running') and callable(entry.is_running) and entry.is_running():
                # Calculate duration for running entries
                duration = (datetime.utcnow() - entry.start_time).total_seconds()
            elif hasattr(entry, 'duration') and entry.duration:
                duration = entry.duration
            else:
                duration = 0
                
            project_totals[project_id]['total_seconds'] += duration
        
        # Format the duration for display
        for project_id in project_totals:
            seconds = project_totals[project_id]['total_seconds']
            hours, remainder = divmod(seconds, 3600)
            minutes, _ = divmod(remainder, 60)
            project_totals[project_id]['formatted_time'] = f"{int(hours)}h {int(minutes)}m"
            
    except Exception as e:
        app.logger.error(f"Error in reports view: {str(e)}")
        flash("An error occurred while loading reports. Please try again.", "danger")
    
    return render_template(
        'reports.html',
        weekly_stats=weekly_stats,
        project_stats=project_stats,
        project_totals=project_totals,
        entries=entries
    )

@app.route('/get-tasks/<int:project_id>')
@login_required
def get_tasks(project_id):
    # Verify project belongs to user
    project = Project.query.filter_by(id=project_id, user_id=current_user.id).first()
    if not project:
        return jsonify([])
    
    tasks = Task.query.filter_by(project_id=project_id).all()
    return jsonify([{'id': task.id, 'name': task.name} for task in tasks])
