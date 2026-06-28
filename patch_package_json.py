import json

with open("package.json", "r") as f:
    data = json.load(f)

data["scripts"]["test:e2e"] = "playwright test"

with open("package.json", "w") as f:
    json.dump(data, f, indent=2)
