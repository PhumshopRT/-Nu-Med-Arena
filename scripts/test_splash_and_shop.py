import time
import os
from playwright.sync_api import sync_playwright

def run_tests():
    os.makedirs("docs/screenshots", exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="msedge", headless=True)
        ctx = browser.new_context(viewport={"width": 1440, "height": 900})
        page = ctx.new_page()

        # 1. Test NucCoin Shop
        print("Navigating to Shop...")
        page.goto("http://localhost:3000/shop/")
        page.wait_for_selector("text=ร้านค้า NucCoin", timeout=10000)
        time.sleep(1.0)
        
        # Verify initial 120 coins
        page.screenshot(path="docs/screenshots/shop_initial_120.png")
        print("Initial shop screenshot captured")

        # Buy frame_gold for 60 coins (Button text: 'ซื้อ 60')
        buy_button = page.locator("button:has-text('ซื้อ 60')").first
        if buy_button.is_visible():
            print("Purchasing Gold Foil frame for 60 coins...")
            buy_button.click()
            time.sleep(1.2)
            page.screenshot(path="docs/screenshots/shop_after_buy.png")
            print("Captured docs/screenshots/shop_after_buy.png")

            # Reload to test persistence
            print("Reloading shop page to test persistence...")
            page.reload()
            page.wait_for_selector("text=ร้านค้า NucCoin", timeout=10000)
            time.sleep(1.2)
            page.screenshot(path="docs/screenshots/shop_after_reload.png")
            print("Captured docs/screenshots/shop_after_reload.png")
        else:
            print("Buy button not found")

        ctx.close()
        browser.close()

if __name__ == "__main__":
    run_tests()
