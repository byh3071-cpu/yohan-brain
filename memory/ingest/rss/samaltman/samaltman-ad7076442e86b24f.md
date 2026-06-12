---
schema_version: ingest.v0
kind: rss
source_name: samaltman
source_feed: https://blog.samaltman.com/posts.atom
source_url: https://blog.samaltman.com/reinforcement-learning-progress
title: Reinforcement Learning Progress
published: 2018-06-25T16:10:37.000Z
guid: null
ingested_at: 2026-06-12T11:20:20.196Z
title_ko: 강화 학습의 발전
summary_ko: OpenAI가 새로운 결과를 발표했습니다. PPO(근접 정책 최적화)라는 강화 학습 알고리즘을 사용하여 5명의 에이전트
  팀을 훈련시켜 Dota 게임에서 준프로를 이겼습니다. 이 에이전트들은 2주 된 에이전트보다 90-95%의 승률로 일관되게 우수한 성과를
  보였으며, 인간이 플레이한 게임에 대한 훈련 없이 스스로 대결을 통해 플레이 방법을 익혔습니다. 이는 깊은 강화 학습이 복잡한 문제를 해결할
  수 있음을 보여주는 중요한 성과이며, 앞으로 다양한 문제 해결에 이 접근 방식을 적용할 계획입니다.
---

# Reinforcement Learning Progress

Today, OpenAI released a new result.  We used PPO (Proximal Policy Optimization), a general reinforcement learning algorithm invented by OpenAI, to train a team of 5 agents to play Dota and beat semi-pros.
This is the game that to me feels closest to the real world and complex decision making (combining strategy, tactics, coordinating, and real-time action) of any game AI had made real progress against so far.
The agents we train consistently outperform two-week old agents with a win rate of 90-95%.  We did this without training on human-played games—we did design the reward functions, of course, but the algorithm figured out how to play by training against itself.
This is a big deal because it shows that deep reinforcement learning can solve extremely hard problems whenever you can throw enough computing scale and a really good simulated environment that captures the problem you’re solving.  We hope to use this same approach to solve very different problems soon.  It's easy to imagine this being applied to environments that look increasingly like the real world.
There are many problems in the world that are far too complex to hand-code solutions for.  I expect this to be a large branch of machine learning, and an important step on the road towards general intelligence.

**원문:** [열기](https://blog.samaltman.com/reinforcement-learning-progress)
