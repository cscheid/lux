#!/usr/bin/env python
import sys
import json
result = []
i = 1
while True:
    x = sys.stdin.readline()
    if x == '': break
    name, _, lat, lon = x.split('|')
    lat = float(lat)
    lon = float(lon)
    result.append({"name": name, "lat": lat, "lon": lon, "id": i})
    i += 1
print json.dumps(result)
    
