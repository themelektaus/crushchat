# My CrushChat Client



## Features

- Multi-language support using the DeepL API (https://deepl.com/api)
- Minimalistic alternative web interface
- Generated images are attached directly to messages



## Demo

- Visit https://crushchat.nockal.com to have a first look.

![](https://github.com/themelektaus/crushchat/blob/main/Screenshots/Screenshot%202023-09-01%20X.png)



## Technical background

This is a .NET 8 application which uses Minimal APIs.
The backend accesses the API from https://crushchat.app.
- Example: https://crushchat.app/api/characters?page=1&limit=25&sortBy=Top

Also, translations from DeepL are cached, so already processed sentences do not need to be translated again.




## Let's go

To use this application, there must be two valid cookie values from CrushChat in the local browser memory. You will be asked to enter them (CSRF and session token). To facilitate the entry, you can use the browser extension EditThisCookie (https://editthiscookie.com).

![](https://github.com/themelektaus/crushchat/blob/main/Screenshots/Screenshot%202023-09-01%20192554.png)

If you want to use another language than English, you have to register at DeepL (https://deepl.com/de/signup?cta=free-login-signup) and create a key for the API (You can find the key here: https://www.deepl.com/de/account/summary). This key has to be entered in the settings as well.

![](https://github.com/themelektaus/crushchat/blob/main/Screenshots/Screenshot%202023-09-01%20192619.png)
