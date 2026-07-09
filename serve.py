#!/usr/bin/env python3
"""Local dev server that disables caching, so a normal browser refresh always
shows your latest edits. Run:  python serve.py   →  http://localhost:8000
(For production on GitHub Pages this file is not used.)"""
import sys
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def log_message(self, *args):
        pass  # quiet


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    print(f"Serving http://localhost:{port}  (no-cache, threaded; Ctrl+C to stop)")
    ThreadingHTTPServer(("", port), NoCacheHandler).serve_forever()
