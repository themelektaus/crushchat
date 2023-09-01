// Setup

(function()
{
    const items = {
        'language': "EN",
        'auto-generate': "true",
        'show-original-messages': "false",
        'hide-images': "false",
        'csrf-token': "",
        'session-token': "",
        'deepl-auth-key': "",
        'deepl-block-size': 10,
        'character-limit': 100,
        'message-limit': 800
    }
    
    for (const key in items)
        if (localStorage.getItem(key) === null)
            localStorage.setItem(key, items[key])
})()

let currentPage = null
let currentCharacter = null
let currentMessage = null

let hasAnyErrors = false
let useCache = true

const $_ = {
    messageInput: q(`#message-input`),
    sendMessageButton: q(`#send-message-button`),
    receiveMessageButton: q(`#receive-message-button`),
    
    settingsDialog: q(`#settings-dialog`),
    messageDialog: q(`#message-dialog`),
}
