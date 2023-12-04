import json, os

curl_str = "curl {} --output {}"
with open('top250.json', 'r') as fp:
	u = json.load(fp)
	for item in u['items']:
		file_name = "{}_{}.jpg".format(item['rank'], item['id'])
		os.system(curl_str.format(item['image'], file_name))
