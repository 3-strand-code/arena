Challenges
==========

This is a place to keep ideas for new challenges.

## Two unique random `value`s from an array of `{ text, value }` objects

Create variables `first` and `second` which are both unique `value` keys from the array of objects.

**data**

```js
const options = _.times(5, n => {
  const text = _.times(3, faker.hacker.noun).join(' ')
  const value = _.snakeCase(text)
  return { text, value }
})
```

**one solution**

```js
const first = _.sample(options).value

let second
while (!second || second === first) second = _.sample(options).value
```


## Refactor if else into ternaries

TODO
