#!/usr/bin/env python3
"""728后台管理系统 Mock API 服务器"""

import json, os
from http.server import HTTPServer, SimpleHTTPRequestHandler

PORT = 9999
STATIC_DIR = os.path.dirname(os.path.abspath(__file__))

def r(code=20000, data=None):
    return json.dumps({"code": code, "data": data or {}}, ensure_ascii=False).encode()

MOCK = {
    "/terrace/login": r(data={"token": "mock-admin-token-728"}),
    "/vue-admin-template/user/login": r(data={"token": "mock-admin-token-728"}),
    "/vue-admin-template/user/info": r(data={
        "roles": ["admin"], "name": "超级管理员",
        "avatar": "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif"
    }),
    "/vue-admin-template/user/logout": r(data="success"),
    "/terrace/mainpage": r(data={
        "today_new_users": 128, "today_active_users": 3427,
        "today_room_count": 891, "today_water": 5268300,
        "total_users": 156892, "total_agents": 328,
        "total_profit": 89321050, "online_users": 1204
    }),
    "/vue-admin-template/table/list": r(data={"items": [], "total": 0}),
}

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=STATIC_DIR, **kwargs)

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type,Authorization,X-Token")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200); self.end_headers()

    def do_POST(self):
        self._handle_api()

    def do_GET(self):
        p = self.path.split("?")[0]
        if p in MOCK:
            self._respond(MOCK[p])
        elif p == "/":
            self.path = "/index.html"
            super().do_GET()
        else:
            super().do_GET()

    def _handle_api(self):
        p = self.path.split("?")[0]
        if p in MOCK:
            self._respond(MOCK[p])
        else:
            self._respond(r())

    def _respond(self, body):
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, f, *a):
        if "200" not in str(a[0]):
            print(f"[API] {a[0]}")

if __name__ == "__main__":
    os.chdir(STATIC_DIR)
    print(f"\n728后台 Mock 服务器: http://localhost:{PORT}\n账号: admin / 123456\n")
    HTTPServer(("0.0.0.0", PORT), Handler).serve_forever()
