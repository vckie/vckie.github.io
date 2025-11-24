---
# the default layout is 'page'
icon: fa-regular fa-newspaper
order: 6
---

Testing

<div class="flipbook-container" style="width:100%; height:650px;">
  Loading flipbook...
</div>

{% raw %}
<!-- CSS for 3D FlipBook (hosted on jsDelivr) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/3d-flip-book@1.9.9/css/white-book-view.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/3d-flip-book@1.9.9/css/font-awesome.min.css">

<!-- Core libraries -->
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.181.2/build/three.core.min.js"></script>

<!-- 3D FlipBook main script -->
<script src="https://cdn.jsdelivr.net/npm/3d-flip-book@1.9.9/dist/flip-book.min.js"></script>

<script>
  jQuery(function ($) {
    $('.flipbook-container').FlipBook({
      pdf: 'https://cdn.vkie.pro/The%20Garden's%20Gentle%20Buzz.pdf'  // <-- change this
    });
  });
</script>
{% endraw %}
