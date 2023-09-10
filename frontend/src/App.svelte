<script lang="ts">
  import Footer from "./lib/Footer.svelte";
  import DropZone from "./lib/DropZone.svelte";
  import { Col, Container, Row, Styles } from "sveltestrap";
</script>

<Styles />

<main>
  <!-- Title -->
  <Container>
    <div class="container title-container">
      <Row>
        <Col>
          <p class="title-text"><b>Leitor de notas de corretagem</b></p>
        </Col>
      </Row>
    </div>
  </Container>
  <!-- Drop zone -->
  <DropZone />
  <!-- Footer -->
  <Footer />
</main>

<style>
  .title-container {
    margin-top: 100px;
  }

  .title-text {
    font-family: "Roboto Slab", serif;
    text-align: center;
    color: #d6d6d6;
    font-size: 50px;
    text-shadow: 0 0 6px #000000, 0 0 10px #000000;
  }
</style>
