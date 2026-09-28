import os
import json
from playwright.sync_api import sync_playwright

screenshot_dir = os.path.join(os.getcwd(), 'docs', 'screenshots')
os.makedirs(screenshot_dir, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, channel="msedge")
    context = browser.new_context(viewport={'width': 1440, 'height': 900})
    page = context.new_page()

    # Clear state first
    print("Navigating to http://localhost:3000 ...")
    page.goto('http://localhost:3000')
    page.wait_for_load_state('networkidle')
    page.evaluate("() => { localStorage.clear(); }")
    page.reload()
    page.wait_for_load_state('networkidle')

    # Skip boot screen
    skip_btn = page.locator('text="กดข้ามหน้ารอโหลด"')
    if skip_btn.is_visible():
        skip_btn.click()
    page.wait_for_selector('button:has-text("PLAY")', timeout=10000)

    # 1. First-time without account: Clicking PLAY opens Login/Register Modal
    print("Clicking PLAY on first visit...")
    page.get_by_role('button', name='PLAY').click()
    page.wait_for_timeout(500)

    # Verify modal is open
    assert page.locator('text="เข้าสู่สังเวียนประลอง"').is_visible(), "Login modal should open"
    page.screenshot(path=os.path.join(screenshot_dir, 'auth_modal_login_tab.png'))
    print("Login modal opened successfully.")

    # 2. Switch to Register Tab
    print("Switching to สมัครใหม่ (REGISTER) tab...")
    page.locator('button:has-text("สมัครใหม่ (REGISTER)")').click()
    page.wait_for_timeout(400)
    assert page.locator('text="สมัครสมาชิกนักศึกษาใหม่"').is_visible(), "Register mode should be active"

    # Fill registration form
    print("Filling registration form for 68208307037...")
    page.get_by_placeholder("เช่น 68208307037").fill("68208307037")
    page.get_by_placeholder("เช่น ภูมิ หรือ หมอนิว").fill("หมอนิว ปี 68")
    
    # Pick Butterfly (Thyroid) avatar
    page.locator('button:has-text("ไทรอยด์")').click()
    page.wait_for_timeout(300)
    page.screenshot(path=os.path.join(screenshot_dir, 'auth_modal_register_filled.png'))

    # Submit Registration
    print("Clicking สมัครสมาชิกและเริ่มเล่น (REGISTER & PLAY)...")
    page.locator('button:has-text("สมัครสมาชิกและเริ่มเล่น")').click()
    page.wait_for_timeout(1800)

    # Verify we entered HomeHub as the registered student
    hub_text = page.locator('header').inner_text()
    print("HomeHub Header Text after register:", hub_text)
    assert "หมอนิว ปี 68" in hub_text or "7037" in hub_text, "User display name or student ID should appear on HomeHub"
    assert "120" in hub_text, "Starter 120 NucCoin should be loaded"
    page.screenshot(path=os.path.join(screenshot_dir, 'auth_registered_hub.png'))
    print("Successfully entered Arena Hub with 120 NucCoin!")

    # 3. Test Session & Persistence ("จำได้เลย"): Reload page to simulate returning user
    print("Simulating returning user: Reloading page...")
    page.goto('http://localhost:3000')
    page.wait_for_load_state('networkidle')
    skip_btn = page.locator('text="กดข้ามหน้ารอโหลด"')
    if skip_btn.is_visible():
        skip_btn.click()
    page.wait_for_selector('button:has-text("PLAY")', timeout=10000)
    page.wait_for_timeout(600)

    # Verify Remembered User Banner appears on Splash counter
    splash_text = page.inner_text('body')
    assert "หมอนิว ปี 68" in splash_text, "Remembered user name must appear on Splash screen"
    assert "68208307037" in splash_text, "Remembered student ID must appear on Splash screen"
    assert "120 NucCoin" in splash_text, "Remembered coin balance must appear on Splash screen"
    assert "บัญชีปัจจุบัน" in splash_text, "Status badge must show 'บัญชีปัจจุบัน'"
    page.screenshot(path=os.path.join(screenshot_dir, 'auth_splash_remembered_banner.png'))
    print("Remembered user banner verified on Splash counter!")

    # 4. Instant Continue: Click PLAY -> Should jump directly to Hub without modal
    print("Clicking PLAY with remembered user (should continue immediately)...")
    page.get_by_role('button', name='PLAY').click()
    page.wait_for_timeout(1000)

    hub_header = page.locator('header').inner_text()
    assert "หมอนิว ปี 68" in hub_header or "7037" in hub_header, "Direct continuation into Hub verified"
    print("Seamless 1-click continuation verified without entering data!")

    # 5. Test Switch Account & Multi-profile Support
    print("Testing Logout and Account Switch...")
    logout_btn = page.locator('button[title="ออกจากระบบ"]')
    logout_btn.click()
    page.wait_for_timeout(600)

    # Now on Splash, click "สลับบัญชี"
    print("Clicking สลับบัญชี...")
    page.locator('button:has-text("สลับบัญชี")').click()
    page.wait_for_timeout(500)

    # Verify saved accounts list shows หมอนิว ปี 68
    body_text = page.inner_text('body')
    assert "บัญชีที่จำไว้บนเครื่องนี้" in body_text, "Saved accounts section must exist"
    assert "หมอนิว ปี 68" in body_text, "First registered student must be in saved accounts list"
    page.screenshot(path=os.path.join(screenshot_dir, 'auth_saved_accounts_list.png'))
    print("Saved accounts list verified!")

    # Register a second account
    print("Registering second account (67208307015)...")
    page.locator('button:has-text("สมัครใหม่ (REGISTER)")').click()
    page.wait_for_timeout(300)
    page.get_by_placeholder("เช่น 68208307037").fill("67208307015")
    page.get_by_placeholder("เช่น ภูมิ หรือ หมอนิว").fill("หมอเปา ปี 67")
    page.locator('button:has-text("ปอด/เส้นเลือด")').click()
    page.locator('button:has-text("สมัครสมาชิกและเริ่มเล่น")').click()
    page.wait_for_timeout(1800)

    hub_header2 = page.locator('header').inner_text()
    assert "หมอเปา ปี 67" in hub_header2 or "7015" in hub_header2, "Second user logged into Hub"
    print("Second user registered and active!")

    # Logout and test 1-click switch back to first user
    logout_btn = page.locator('button[title="ออกจากระบบ"]')
    logout_btn.click()
    page.wait_for_timeout(600)

    page.locator('button:has-text("สลับบัญชี")').click()
    page.wait_for_timeout(500)

    # Click first account card to switch back in 1 click!
    print("Clicking หมอนิว ปี 68 card for 1-click switch...")
    page.locator('div:has-text("หมอนิว ปี 68")').last.click()
    page.wait_for_timeout(1000)

    hub_header3 = page.locator('header').inner_text()
    assert "หมอนิว ปี 68" in hub_header3 or "7037" in hub_header3, "Switched back to first user successfully"
    print("1-Click Account Switch verified flawlessly!")

    browser.close()
    print("ALL AUTHENTICATION & REGISTRATION PERSISTENCE TESTS PASSED FLAWLESSLY!")
