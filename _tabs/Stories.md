---
# the default layout is 'page'
icon: fa-regular fa-newspaper
order: 6
---

Testing

<div id="cyber-book" style="width:100%; height:650px; border:1px solid #ddd;">
    Loading flipbook...
</div>

<!-- jQuery -->
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>

<!-- FlowPaper JS (host this locally or use your hosted version) -->
<script src="/flowpaper/FlowPaper.js"></script>

<script>
    $(function () {
        $('#cyber-book').FlowPaperViewer({
            config: {
                PDFFile: 'https://cdn.vkie.pro/The%20Garden's%20Gentle%20Buzz.pdf',
                ViewMode: 'FlipBook',
                AutoDetectLinks: true
            }
        });
    });
</script>
