---
title: stories
icon: fa-regular fa-newspaper
order: 6
---

<div class="stories-grid">
  {% assign sorted_stories = site.stories | sort: 'date' | reverse %}
  
  {% if sorted_stories.size == 0 %}
    <div class="empty-state">
      <i class="fas fa-book-open fa-3x text-muted mb-3"></i>
      <h3>No stories yet</h3>
      <p class="text-muted">Stories will appear here once you add them to <code>_stories/</code></p>
    </div>
  {% else %}
    {% for story in sorted_stories %}
      <a href="{{ story.url | relative_url }}" class="story-card" style="text-decoration: none;">
        <div class="story-icon">
          {% if story.icon contains 'http' %}
            <div style="width: 3rem; height: 3rem; background-image: url('{{ story.icon }}'); background-size: cover; background-position: center; border-radius: 8px;"></div>
          {% else %}
            {{ story.icon | default: "📖" }}
          {% endif %}
        </div>
        <h3 class="story-title">{{ story.title }}</h3>
        <p class="story-description">{{ story.description }}</p>
        <div class="story-meta">
          <i class="far fa-calendar-alt fa-fw"></i>
          <time>{{ story.date | date: "%b %d, %Y" }}</time>
        </div>
      </a>
    {% endfor %}
  {% endif %}
</div>

<style>
  .stories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
    padding: 2rem 0;
  }

  .empty-state {
    grid-column: 1 / -1;
    text-align: center;
    padding: 4rem 2rem;
  }

  .story-card {
    background: var(--card-bg);
    border: 1px solid var(--card-border-color);
    border-radius: 12px;
    padding: 2rem;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .story-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.2);
    border-color: var(--link-color);
  }

  .story-icon {
    font-size: 3rem;
    margin-bottom: 0.5rem;
  }

  .story-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--heading-color);
    margin: 0;
  }

  .story-description {
    color: var(--text-muted-color);
    margin: 0;
    flex-grow: 1;
  }

  .story-meta {
    font-size: 0.9rem;
    color: var(--text-muted-color);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  @media (max-width: 768px) {
    .stories-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
  }
</style>
