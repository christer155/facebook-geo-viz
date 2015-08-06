# Convert locations.tsv file into js-compatible format 

from datetime import datetime
import json 

conversions = {
			   'Today':'March 17, 2015', 
			   'Monday': 'March 16, 2015',
			   'Sunday': 'March 15, 2015',
			   'Saturday': 'March 14, 2015',
			   'Friday': 'March 13, 2015',
			   'Thursday': 'March 12, 2015',
			   'Wednesday': 'March 11, 2015',
			   'Tuesday': 'March 10, 2015'
			   }

lines = open("location_history_carolyn.tsv").read().splitlines()
locations = []
for line in lines: 
	lat, lng, date = line.split('\t')
	if date in conversions:
		date = conversions[date]
	elif date.count(',') == 1:
		date = date.replace(',', ', 2015 ')
	else:
		parts = date.split(',')
		date = parts[0] + ', ' + parts[1] + ' ' + parts[2]
	locations.append({'lat': float(lat), 'lng': float(lng), 'date': date})

# Sort locations by date 
locations.sort(key=lambda l: datetime.strptime(l['date'], '%B %d, %Y %H:%M'))

for location in locations:
	print location['date']

json.dump(locations, open('locations_carolyn.js', 'w'))