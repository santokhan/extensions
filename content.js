function applyRules(rules) {
    rules.forEach(rule => {
        let elements = []

        if (rule.type === "name") {
            elements = document.querySelectorAll(`[name="${rule.selector}"]`)
        } else if (rule.type === "id") {
            elements = document.querySelectorAll(`#${rule.selector}`)
        } else if (rule.type === "class") {
            elements = document.querySelectorAll(`.${rule.selector}`)
        }

        elements.forEach(el => {
            if (!el) return

            if (
                el.tagName === "INPUT" ||
                el.tagName === "TEXTAREA" ||
                el.tagName === "SELECT"
            ) {
                const setter = Object.getOwnPropertyDescriptor(
                    window.HTMLInputElement.prototype,
                    "value"
                )?.set

                if (setter) {
                    setter.call(el, rule.value)
                } else {
                    el.value = rule.value
                }

                el.dispatchEvent(new Event("input", { bubbles: true }))
                el.dispatchEvent(new Event("change", { bubbles: true }))
            }
        })
    })
}

// Listen from popup
chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action === "applyRule") {
        applyRules([msg.rule])
    }

    if (msg.action === "applyAllRules") {
        chrome.storage.local.get("rules", (res) => {
            applyRules(res.rules || [])
        })
    }
})