### JS Client Example

```js
const eventSource = new EventSource('/btcusdt-sse');
eventSource.onmessage = ({ data }) => {
  console.log(data)
}
```