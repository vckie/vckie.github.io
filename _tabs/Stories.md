---
# the default layout is 'page'
icon: fa-regular fa-newspaper
order: 6
---

Testing

<div class="flipbook-container" style="width:100%;height:600px;"></div>

<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<!-- Include 3D FlipBook JS + CSS from the plugin files -->
<link rel="stylesheet" href="/3dflipbook/3dflipbook.css">
<script src="/3dflipbook/3dflipbook.min.js"></script>

<script>
  jQuery(function ($) {
    var options = {
      pdf: 'https://cdn.vkie.pro/The%20Garden's%20Gentle%20Buzz.pdf'
      // plus any other options you like: controls, backgrounds, etc.
    };

    $('.flipbook-container').FlipBook(options);
  });
</script>
