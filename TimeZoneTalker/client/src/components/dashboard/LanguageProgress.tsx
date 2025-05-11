import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { INITIAL_LANGUAGES } from "@/lib/constants";
import { PlusIcon } from "lucide-react";

export default function LanguageProgress() {
  // Fetch languages data
  const { data: languages, isLoading } = useQuery({
    queryKey: ["/api/languages"],
    initialData: INITIAL_LANGUAGES,
  });

  return (
    <Card>
      <CardHeader className="p-6 border-b border-gray-200">
        <CardTitle className="text-lg">Your Languages</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {languages.map((language) => (
              <div key={language.id}>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">{language.name}</h3>
                  <span className="text-sm text-gray-500">{language.level}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-primary-500 h-2.5 rounded-full" 
                    style={{ width: `${language.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
            
            <Button
              variant="outline"
              className="w-full flex items-center justify-center text-sm py-2 border border-dashed border-gray-300 rounded-md hover:border-gray-400 hover:bg-gray-50"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              <span>Add a new language</span>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
