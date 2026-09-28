import time
from playwright.sync_api import sync_playwright

def capture():
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="msedge", headless=True)
        
        # 1. 1440x900 viewport
        context_1440 = browser.new_context(viewport={"width": 1440, "height": 900})
        page_1440 = context_1440.new_page()
        page_1440.goto("http://localhost:3000/")
        
        # Click Skip or wait for BootScreen to complete into TitleSplash
        try:
            page_1440.wait_for_selector("text=กดข้ามหน้าจอโหลด", timeout=4000)
            page_1440.click("text=กดข้ามหน้าจอโหลด")
        except Exception:
            pass
        
        page_1440.wait_for_selector("text=เข้าห้องด้วยรหัส", timeout=10000)
        time.sleep(1.2)  # Let animations settle
        page_1440.screenshot(path="docs/screenshots/splash_1440x900.png")
        print("Captured TitleSplash at 1440x900")
        context_1440.close()
        
        # 2. 1180x820 viewport
        context_1180 = browser.new_context(viewport={"width": 1180, "height": 820})
        page_1180 = context_1180.new_page()
        page_1180.goto("http://localhost:3000/")
        
        try:
            page_1180.wait_for_selector("text=กดข้ามหน้าจอโหลด", timeout=4000)
            page_1180.click("text=กดข้ามหน้าจอโหลด")
        except Exception:
            pass
        
        page_1180.wait_for_selector("text=เข้าห้องด้วยรหัส", timeout=10000)
        time.sleep(1.2)
        page_1180.screenshot(path="docs/screenshots/splash_1180x820.png")
        print("Captured TitleSplash at 1180x820")
        context_1180.close()
        
        browser.close()

if __name__ == "__main__":
    capture()
