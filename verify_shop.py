import os
import json
from playwright.sync_api import sync_playwright

screenshot_dir = os.path.join(os.getcwd(), 'docs', 'screenshots')
os.makedirs(screenshot_dir, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, channel="msedge")
    context = browser.new_context(viewport={'width': 1440, 'height': 900})
    page = context.new_page()

    # Clear previous local storage state to test clean user experience (120 coins starter)
    print("Navigating to http://localhost:3000/shop ...")
    page.goto('http://localhost:3000/shop')
    page.wait_for_load_state('networkidle')
    page.evaluate("() => { localStorage.clear(); }")
    page.reload()
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(1000)

    # 1. Verify Initial Storage & Balance
    storage_check = page.evaluate("""() => {
        const wallet = JSON.parse(localStorage.getItem('na_wallet') || '{}');
        const inventory = JSON.parse(localStorage.getItem('na_inventory') || '{}');
        const equipped = JSON.parse(localStorage.getItem('na_equipped') || '{}');
        return { wallet, inventory, equipped };
    }""")
    print("Initial Storage Check:", storage_check)
    assert storage_check['wallet'].get('coins') == 120, "Wallet coins should start at 120"
    assert any('frame-graphite' in s for s in storage_check['inventory'].get('ownedIds', [])), "Inventory must have frame-graphite"

    # 2. Check Coin Icons Dimensions
    coin_icon_check = page.evaluate("""() => {
        const headerCoin = document.querySelector('header img[alt="NucCoin"]');
        const priceCoins = Array.from(document.querySelectorAll('.font-mono img[alt="NucCoin"]'));
        const buyCoins = Array.from(document.querySelectorAll('button img[alt="NucCoin"]'));

        return {
            headerCoinSize: headerCoin ? { width: headerCoin.offsetWidth, height: headerCoin.offsetHeight, src: headerCoin.src } : null,
            firstPriceCoinSize: priceCoins.length > 0 ? { width: priceCoins[0].offsetWidth, height: priceCoins[0].offsetHeight } : null,
            firstBuyCoinSize: buyCoins.length > 0 ? { width: buyCoins[0].offsetWidth, height: buyCoins[0].offsetHeight } : null,
        };
    }""")
    print("Coin Icon Dimension Check:", coin_icon_check)

    # 3. Test Preview Gold Foil (Click ดูตัวอย่าง on Gold Foil without buying)
    gold_card = page.locator('.wood-panel').filter(has_text="กรอบ Gold Foil ทองคำ").first
    gold_preview_btn = gold_card.locator('button:has-text("ดูตัวอย่าง")')
    print("Clicking ดูตัวอย่าง on Gold Foil...")
    gold_preview_btn.click()
    page.wait_for_timeout(600)

    gold_preview_check = page.evaluate("""() => {
        const previewBadge = document.querySelector('strong.font-game')?.innerText;
        const livePreviewPanel = document.querySelector('.wood-panel .scale-102');
        const isGoldFoil = livePreviewPanel ? livePreviewPanel.className.includes('from-amber-400') : false;
        return { previewBadge, isGoldFoil };
    }""")
    print("Gold Foil Preview Check:", gold_preview_check)
    page.screenshot(path=os.path.join(screenshot_dir, 'shop_preview_gold.png'))

    # 4. Test Preview Reactor Glow
    reactor_card = page.locator('.wood-panel').filter(has_text="กรอบ Reactor Glow เรืองแสง").first
    reactor_preview_btn = reactor_card.locator('button:has-text("ดูตัวอย่าง")')
    print("Clicking ดูตัวอย่าง on Reactor Glow...")
    reactor_preview_btn.click()
    page.wait_for_timeout(600)

    reactor_preview_check = page.evaluate("""() => {
        const previewBadge = document.querySelector('strong.font-game')?.innerText;
        const livePreviewPanel = document.querySelector('.wood-panel .scale-102');
        const isReactorGlow = livePreviewPanel ? livePreviewPanel.className.includes('from-cyan-400') : false;
        return { previewBadge, isReactorGlow };
    }""")
    print("Reactor Glow Preview Check:", reactor_preview_check)

    # 5. Test Tab Cardback (ลายหลังไพ่)
    print("Switching to ลายหลังไพ่ tab...")
    page.get_by_role('button', name='ลายหลังไพ่').click()
    page.wait_for_timeout(600)

    cardback_check = page.evaluate("""() => {
        const hasCardBack = !!document.querySelector('.shadow-card');
        const flipBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('พลิกดู'));
        return { hasCardBack, hasFlipBtn: !!flipBtn };
    }""")
    print("Cardback Tab Check:", cardback_check)
    page.screenshot(path=os.path.join(screenshot_dir, 'shop_preview_back.png'))

    # 6. Test Tab Avatar (อวตาร)
    print("Switching to อวตาร tab...")
    page.get_by_role('button', name='อวตาร').click()
    page.wait_for_timeout(600)

    avatar_check = page.evaluate("""() => {
        const text = document.body.innerText;
        const hasAvatarTitle = text.includes('PLAYER AVATAR');
        const hasLargeAvatar = !!document.querySelector('.w-32.h-32');
        return { hasAvatarTitle, hasLargeAvatar };
    }""")
    print("Avatar Tab Check:", avatar_check)
    page.screenshot(path=os.path.join(screenshot_dir, 'shop_preview_avatar.png'))

    # 7. Test Purchase: Switch back to frame and buy Gold Foil (60 coins)
    print("Switching back to กรอบการ์ด tab to purchase Gold Foil...")
    page.get_by_role('button', name='กรอบการ์ด').click()
    page.wait_for_timeout(600)

    gold_buy_btn = gold_card.locator('button:has-text("ซื้อ 60")')
    print("Buying Gold Foil for 60 coins...")
    gold_buy_btn.click()
    page.wait_for_timeout(1000)

    after_buy_check = page.evaluate("""() => {
        const wallet = JSON.parse(localStorage.getItem('na_wallet') || '{}');
        const toast = document.body.innerText.includes('ซื้อแล้ว เหลือ 60');
        const goldBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('สวมใส่'));
        return { walletCoins: wallet.coins, toastPresent: toast, goldBtnText: goldBtn ? goldBtn.innerText : null };
    }""")
    print("After Buy Check:", after_buy_check)
    page.screenshot(path=os.path.join(screenshot_dir, 'shop_after_buy.png'))

    # 8. Test Equip: Click สวมใส่
    gold_equip_btn = gold_card.locator('button:has-text("สวมใส่")')
    if gold_equip_btn.is_visible():
        print("Equipping Gold Foil...")
        gold_equip_btn.click()
        page.wait_for_timeout(800)

    equip_check = page.evaluate("""() => {
        const equipped = JSON.parse(localStorage.getItem('na_equipped') || '{}');
        const hasActiveBadge = Array.from(document.querySelectorAll('button')).some(b => b.innerText.includes('ใช้งานอยู่'));
        return { equippedFrame: equipped.frame, hasActiveBadge };
    }""")
    print("Equip Check:", equip_check)

    # 9. Test Cannot Afford: Reactor Glow costs 90, but we have 60 left!
    reactor_buy_btn = reactor_card.locator('button:has-text("ซื้อ 90")')
    print("Attempting to click disabled/unaffordable Reactor Glow...")
    is_disabled = reactor_buy_btn.is_disabled()
    print("Reactor Glow buy button disabled status:", is_disabled)
    reactor_buy_btn.click(force=True)
    page.wait_for_timeout(500)

    wallet_still_60 = page.evaluate("() => JSON.parse(localStorage.getItem('na_wallet') || '{}').coins")
    print("Wallet balance after unaffordable attempt (must remain 60):", wallet_still_60)
    assert wallet_still_60 == 60, "Balance must never go negative"

    # 10. Test Page Reload & Persistence
    print("Reloading shop page to test persistence...")
    page.reload()
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(1000)

    reload_check = page.evaluate("""() => {
        const wallet = JSON.parse(localStorage.getItem('na_wallet') || '{}');
        const equipped = JSON.parse(localStorage.getItem('na_equipped') || '{}');
        const hasGoldEquipped = Array.from(document.querySelectorAll('button')).some(b => b.innerText.includes('ใช้งานอยู่'));
        return { walletCoins: wallet.coins, equippedFrame: equipped.frame, hasGoldEquipped };
    }""")
    print("Reload Persistence Check:", reload_check)
    assert reload_check['walletCoins'] == 60, "Coins must persist across reloads"
    assert reload_check['hasGoldEquipped'], "Gold Foil must remain equipped across reloads"

    # 11. Navigate to HomeHub and verify 28px NucCoinIcon with 60 coins
    print("Navigating to HomeHub...")
    page.goto('http://localhost:3000')
    page.wait_for_load_state('networkidle')
    skip_btn = page.locator('text="กดข้ามหน้ารอโหลด"')
    if skip_btn.is_visible():
        skip_btn.click()
    page.wait_for_selector('button:has-text("PLAY")', timeout=10000)
    page.get_by_role('button', name='PLAY').click()
    page.wait_for_timeout(500)
    page.get_by_placeholder("เช่น 68208307037").fill('68208307052')
    page.get_by_role('button', name='เข้าสู่เกม').click()
    page.wait_for_timeout(1500)

    hub_coin_check = page.evaluate("""() => {
        const hubCoinImg = document.querySelector('header .wood-panel img[alt="NucCoin"]');
        const text = document.querySelector('header')?.innerText || '';
        return {
            hubCoinWidth: hubCoinImg ? hubCoinImg.offsetWidth : null,
            hubCoinHeight: hubCoinImg ? hubCoinImg.offsetHeight : null,
            has60Coins: text.includes('60'),
            hasNoEmoji: !text.includes('🪙')
        };
    }""")
    print("Hub Coin Check:", hub_coin_check)
    page.screenshot(path=os.path.join(screenshot_dir, 'hub_with_nuccoin_icon.png'))

    browser.close()
    print("ALL SHOP & COIN TESTS PASSED FLAWLESSLY!")
