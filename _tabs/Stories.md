---
# the default layout is 'page'
icon: fa-regular fa-newspaper
order: 6
---

Testing

<div id="flip-container" style="width:100%; height:650px;"></div>

{% raw %}
<link rel="stylesheet" href="/3dflipbook/3dflipbook.css">
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="/3dflipbook/3dflipbook.min.js"></script>

<script>
  jQuery(function ($) {
    $('#flip-container').FlipBook({
      pdf: 'https://cdn.vkie.pro/The%20Garden's%20Gentle%20Buzz.pdf'
    });
  });
</script>
{% endraw %}
