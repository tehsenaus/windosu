# windosu - sudo for Windows that just works.

## How?

Install it:
```
npm install -g windosu
```

Use it:
```
sudo make me-a-sandwich
```

You may need to add `%appdata%\npm` to path.

## Use it in your programs

```
require('windosu').exec(
	"some-command some args"
)
```


## What's this .latte stuff?

windosu is written in Latte, a delicious superset of JavaScript. Check it out here:
https://github.com/tehsenaus/latte-js

