import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/components/ui/card";
import { Button } from "@/components/components/ui/button";
import { Avategar, AvatarImage, AvatarFallback } from "@/components/components/ui/avatar";
import { Edit, MapPin, Share2, Heart } from "lucide-react";
import { Badge } from "@/components/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/components/ui/tooltip";

interface HubDetailsCardProps {
  name: string;
  description: string;
  location: string;
  logo: string | null;
  coverImage: string | null;
}

export const HubDetailsCard: React.FC<HubDetailsCardProps> = ({
  name,
  description,
  location,
  logo,
  coverImage
}) => {
  return (
    <Card className="w-full overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-0">
      {coverImage && (
        <div className="relative w-full h-48">
          <img
            src={`data:image/png;base64,${coverImage}`}
            alt="Hub Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
        </div>
      )}
      
      <CardHeader className={coverImage ? "-mt-20 relative z-10" : ""}>
        <div className="flex items-center gap-4">
        <Avatar className="w-20 h-20 border-4 border-background shadow-md">
            {logo ? (
                <AvatarImage src={`data:image/png;base64,${logo}`} alt={`${name} Logo`} />
            ) : (
                <AvatarFallback className="text-xl font-bold bg-primary text-primary-foreground">
                {name.charAt(0)}
                </AvatarFallback>
            )}
        </Avatar>


          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{name}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <MapPin className="w-4 h-4" />
                  {location}
                </CardDescription>
              </div>
              
              <Badge variant="outline" className="font-normal">
                Business Hub
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Edit className="w-4 h-4" />
            Edit
          </Button>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Share2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share hub</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Heart className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Save as favorite</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <Badge variant="secondary" className="font-normal">
          Online
        </Badge>
      </CardFooter>
    </Card>
  );
};