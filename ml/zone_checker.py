from shapely.geometry import Point, Polygon
from typing import List, Tuple
import numpy as np
import cv2 as cv

ZoneCoords = List[Tuple[int,int]]


class ZoneChecker:

    def __init__(self, safe_zones: List[ZoneCoords] = None):
        self.safe_zones:List[Polygon]=[]

        if safe_zones:
            for zone_cordinations in safe_zones:
                self.safe_zones.append(Polygon(zone_cordinations))
    

    def add_zones(self,coords:ZoneCoords):
        self.safe_zones.append(Polygon(coords))

    def is_in_safe_zone(self,foot_point:Tuple[int,int])->bool:
        if not self.safe_zones:
            return True
        
        point = Point(foot_point)
        
        return any(zone.contains(point) for zone in self.safe_zones)
    
    def get_foot_point(self, bbox: Tuple[int, int, int, int]) -> Tuple[int, int]:
        x1,y1,x2,y2=bbox
        center_x=int((x1+x2)/2)
        bottom_y=int(y2)

        return (center_x,bottom_y)
    
    def draw_zones(self, frame: np.ndarray) -> np.ndarray:
       
        output = frame.copy()

        for zone in self.safe_zones:
            
            coords = np.array(zone.exterior.coords, dtype=np.int32)

           
            overlay = output.copy()
            cv.fillPoly(overlay, [coords], color=(0, 255, 0))
           
            cv.addWeighted(overlay, 0.3, output, 0.7, 0, output)

            
            cv.polylines(output, [coords], isClosed=True,color=(0, 255, 0), thickness=2)

        return output