// import React from "react";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/componets/ui/card";
// import { Scissors, Smile, Clock, Star } from "lucide-react";
// import { Button } from "@/components/componets/ui/button";
// import { Badge } from "@/components/componets/ui/badge";

// interface Service {
//   id: string;
//   name: string;
//   description: string;
//   price: number;
// }

// interface ServicesListProps {
//   services: Service[];
// }

// export const ServicesList: React.FC<ServicesListProps> = ({ services }) => {
//   return (
//     <Card className="w-full border-0 shadow-md bg-card">
//       <CardHeader className="pb-3 border-b">
//         <CardTitle className="flex items-center gap-2 text-xl">
//           <Scissors className="w-5 h-5 text-primary" />
//           Services
//         </CardTitle>
//       </CardHeader>
//       <CardContent className="p-0">
//         {services.length > 0 ? (
//           <div>
//             {services.map((service, index) => (
//               <div 
//                 key={service.id} 
//                 className={`p-6 flex items-start gap-4 ${
//                   index !== services.length - 1 ? "border-b" : ""
//                 } hover:bg-muted/50 transition-colors`}
//               >
//                 <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
//                   <Smile className="w-6 h-6 text-primary" />
//                 </div>
                
//                 <div className="flex-1">
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{service.name}</h3>
//                       <p className="text-muted-foreground mt-1">{service.description}</p>
                      
//                       <div className="flex items-center gap-4 mt-3">
//                         <div className="flex items-center text-sm text-muted-foreground">
//                           <Clock className="w-4 h-4 mr-1" />
//                           <span>30 min</span>
//                         </div>
//                         <div className="flex items-center text-sm text-muted-foreground">
//                           <Star className="w-4 h-4 mr-1 text-yellow-500" />
//                           <span>4.9</span>
//                         </div>
//                       </div>
//                     </div>
                    
//                     <div className="flex items-center gap-2">
//                       <Badge variant="secondary" className="font-normal">
//                         ${service.price}
//                       </Badge>
//                       <Button size="sm" variant="outline">Book</Button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="p-8 text-center">
//             <Scissors className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
//             <h3 className="text-lg font-medium mb-2">No services available</h3>
//             <p className="text-muted-foreground mb-4">Start by adding services to your hub.</p>
//             <Button>Add Service</Button>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// };