<script lang="ts">
  let count: number = 0;
  const increment = () => {
    count += 1;
  };

  // // Listen to server requests
  // window.api.getCounterResponseFromServer((_, data) => {
  //   console.log(`Received ${JSON.stringify(data)} from main process`);
  // });

  // $: {
  //   // Send a message to the main process every time the counter is updated
  //   window.api.updateServerCounter(count);
  // }
</script>

<button title="count-button" on:click={increment}>
  count is {count}
</button>
