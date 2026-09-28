import time
import os
from playwright.sync_api import sync_playwright

def capture():
    os.makedirs("docs/screenshots", exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="msedge", headless=True)
        
        # 1. Capture Boot Screen
        ctx_boot = browser.new_context(viewport={"width": 1440, "height": 900})
        page_boot = ctx_boot.new_page()
        page_boot.goto("http://localhost:3000/")
        page_boot.wait_for_selector("text=CHARGING REACTOR", timeout=10000)
        time.sleep(0.8)
        page_boot.screenshot(path="docs/screenshots/boot_screen.png")
        print("Captured BootScreen at 1440x900")
        ctx_boot.close()

        # 2. Capture Title Splash Screen
        ctx_splash = browser.new_context(viewport={"width": 1440, "height": 900})
        page_splash = ctx_splash.new_page()
        page_splash.goto("http://localhost:3000/")
        
        # Click skip button to land on Title Splash
        try:
            page_splash.wait_for_selector("text=Skip", timeout=5000)
            page_splash.click("text=Skip")
        except Exception as e:
            print("Skip button click note:", e)
        
        page_splash.wait_for_selector("text=PLAY", timeout=10000)
        time.sleep(1.2)
        page_splash.screenshot(path="docs/screenshots/splash_1440x900.png")
        print("Captured TitleSplash at 1440x900")

        # 3. Capture Login Modal (Invalid ID test)
        page_splash.get_by_role("button", name="PLAY").click()
        page_splash.wait_for_selector("text=เข้าสู่สังเวียนไพ่นิวเคลียร์", timeout=5000)
        
        # Type invalid ID (e.g. 68208307080 -> seat 80 > 55)
        page_splash.locator("input[type='text']").first.fill("68208307080")
        page_splash.get_by_role("button", name="เข้าสู่เกม (ENTER GAME)").click()
        time.sleep(0.6)
        page_splash.screenshot(path="docs/screenshots/login_modal_error.png")
        print("Captured LoginModal Error at 1440x900")

        # 4. Capture Login Modal (Valid ID test with quick chip)
        page_splash.locator("button:has-text('68208307037')").click()
        time.sleep(0.6)
        page_splash.screenshot(path="docs/screenshots/login_modal_valid.png")
        print("Captured LoginModal Valid at 1440x900")

        ctx_splash.close()
        browser.close()

if __name__ == "__main__":
    capture()
