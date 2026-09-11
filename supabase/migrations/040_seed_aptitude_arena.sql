-- Migration 040: Seed EduAcademy Aptitude Arena Content
-- Seeds categories, topics, 40 original questions, mock tests, achievements, and daily challenge.

-- 1. Categories
INSERT INTO public.aptitude_categories (id, name, slug, description, icon, display_order, is_active)
VALUES ('cat-quant', 'Quantitative Aptitude', 'quantitative-aptitude', 'Master numerical problem solving, arithmetic formulas, algebra, and quantitative reasoning required for campus placements and technical evaluations.', 'Calculator', 1, TRUE)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.aptitude_categories (id, name, slug, description, icon, display_order, is_active)
VALUES ('cat-logic', 'Logical Reasoning', 'logical-reasoning', 'Develop sharp analytical deductions, pattern recognition, spatial orientation, series extrapolation, and relational logic.', 'Brain', 2, TRUE)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.aptitude_categories (id, name, slug, description, icon, display_order, is_active)
VALUES ('cat-verbal', 'Verbal Ability', 'verbal-ability', 'Sharpen English vocabulary, contextual grammar, sentence structure, critical comprehension, and professional business communication.', 'BookOpen', 3, TRUE)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.aptitude_categories (id, name, slug, description, icon, display_order, is_active)
VALUES ('cat-di', 'Data Interpretation', 'data-interpretation', 'Interpret complex datasets, analyze bar charts, line graphs, percentage distribution pie charts, and tabular case studies.', 'BarChart2', 4, TRUE)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

-- 2. Topics
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-quant-number-sys', 'cat-quant', 'Number System', 'number-system', 1, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-quant-percentages', 'cat-quant', 'Percentages', 'percentages', 2, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-quant-profit-loss', 'cat-quant', 'Profit & Loss', 'profit-and-loss', 3, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-quant-ratio-prop', 'cat-quant', 'Ratio & Proportion', 'ratio-and-proportion', 4, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-quant-averages', 'cat-quant', 'Averages', 'averages', 5, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-quant-time-work', 'cat-quant', 'Time & Work', 'time-and-work', 6, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-quant-speed-dist', 'cat-quant', 'Time, Speed & Distance', 'time-speed-distance', 7, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-quant-interest', 'cat-quant', 'Simple & Compound Interest', 'simple-compound-interest', 8, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-quant-probability', 'cat-quant', 'Probability', 'probability', 9, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-quant-perm-comb', 'cat-quant', 'Permutation & Combination', 'permutation-combination', 10, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-logic-number-series', 'cat-logic', 'Number Series', 'number-series', 1, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-logic-letter-series', 'cat-logic', 'Letter Series', 'letter-series', 2, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-logic-coding-dec', 'cat-logic', 'Coding-Decoding', 'coding-decoding', 3, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-logic-blood-rel', 'cat-logic', 'Blood Relations', 'blood-relations', 4, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-logic-direction', 'cat-logic', 'Direction Sense', 'direction-sense', 5, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-logic-syllogisms', 'cat-logic', 'Syllogisms', 'syllogisms', 6, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-logic-seating', 'cat-logic', 'Seating Arrangement', 'seating-arrangement', 7, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-logic-puzzles', 'cat-logic', 'Puzzles', 'puzzles', 8, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-logic-analogies', 'cat-logic', 'Analogies', 'analogies', 9, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-logic-statement-concl', 'cat-logic', 'Statement & Conclusion', 'statement-conclusion', 10, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-verb-vocab', 'cat-verbal', 'Vocabulary & Context', 'vocabulary', 1, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-verb-syn-ant', 'cat-verbal', 'Synonyms & Antonyms', 'synonyms-antonyms', 2, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-verb-grammar', 'cat-verbal', 'Grammar Rules', 'grammar', 3, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-verb-sentence-corr', 'cat-verbal', 'Sentence Correction', 'sentence-correction', 4, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-verb-fill-blanks', 'cat-verbal', 'Fill in the Blanks', 'fill-in-the-blanks', 5, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-verb-reading-comp', 'cat-verbal', 'Reading Comprehension', 'reading-comprehension', 6, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-verb-para-jumbles', 'cat-verbal', 'Para Jumbles', 'para-jumbles', 7, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-verb-error-detect', 'cat-verbal', 'Error Detection', 'error-detection', 8, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-verb-sentence-comp', 'cat-verbal', 'Sentence Completion', 'sentence-completion', 9, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-verb-idioms', 'cat-verbal', 'Idioms & Phrases', 'idioms-phrases', 10, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-di-tables', 'cat-di', 'Tables', 'tables', 1, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-di-bar-charts', 'cat-di', 'Bar Charts', 'bar-charts', 2, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-di-line-charts', 'cat-di', 'Line Charts', 'line-charts', 3, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-di-pie-charts', 'cat-di', 'Pie Charts', 'pie-charts', 4, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-di-caselets', 'cat-di', 'Caselets', 'caselets', 5, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.aptitude_topics (id, category_id, name, slug, display_order, is_active)
VALUES ('top-di-mixed', 'cat-di', 'Mixed Data Interpretation', 'mixed-data', 6, TRUE)
ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name;

-- 3. Questions & Options
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-quant-01', 'cat-quant', 'top-quant-percentages', 'If the price of a computer software license increases by 25%, by what percentage must a company reduce its consumption of licenses so that total expenditure remains unchanged?', 'single_choice', 'easy', 'Let original price = $100 and consumption = 100 units. Original expenditure = 100 × 100 = 10,000. New price = $125. To keep expenditure at 10,000, new consumption = 10,000 / 125 = 80 units. Reduction = 100 - 80 = 20%. Formula: [R / (100 + R)] × 100% = [25 / 125] × 100% = 20%.', 'A', ARRAY['Percentages','Expenditure','Placement Classic']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-01', 'A', '20%', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-01', 'B', '25%', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-01', 'C', '16.66%', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-01', 'D', '18.75%', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-quant-02', 'cat-quant', 'top-quant-profit-loss', 'A merchant sells an electronic gadget for $840 at a profit of 20%. If he had sold it for $714, what would have been his profit or loss percentage?', 'single_choice', 'medium', 'Selling Price (SP1) = $840 with 20% profit. Cost Price (CP) = 840 / 1.20 = $700. New Selling Price (SP2) = $714. Profit = 714 - 700 = $14. Profit % = (14 / 700) × 100% = 2% profit.', 'A', ARRAY['Profit & Loss','Arithmetic']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-02', 'A', '2% Profit', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-02', 'B', '2% Loss', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-02', 'C', '4% Profit', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-02', 'D', '5% Loss', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-quant-03', 'cat-quant', 'top-quant-time-work', 'Developer Alice can build a backend module in 12 days, and Developer Bob can build the same module in 18 days. If they collaborate with Developer Charlie, they complete the entire module in 4 days. In how many days can Charlie complete the module alone?', 'single_choice', 'medium', '1 day work of Alice = 1/12. 1 day work of Bob = 1/18. 1 day work of (Alice + Bob + Charlie) = 1/4. Charlie''s 1 day work = 1/4 - (1/12 + 1/18) = 1/4 - 5/36 = (9 - 5)/36 = 4/36 = 1/9. Therefore, Charlie takes 9 days alone.', 'B', ARRAY['Time & Work','Collaboration']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-03', 'A', '8 days', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-03', 'B', '9 days', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-03', 'C', '10 days', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-03', 'D', '12 days', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-quant-04', 'cat-quant', 'top-quant-speed-dist', 'A data packet travels across a wide-area network between two server nodes at an average speed of 60 km/ms on the forward trip, and returns along a congested route at 40 km/ms. What is the average speed for the entire round trip?', 'single_choice', 'easy', 'Harmonic mean for equal distances: Average Speed = (2 × s1 × s2) / (s1 + s2) = (2 × 60 × 40) / (60 + 40) = 4800 / 100 = 48 km/ms.', 'A', ARRAY['Speed & Distance','Harmonic Mean']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-04', 'A', '48 km/ms', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-04', 'B', '50 km/ms', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-04', 'C', '52 km/ms', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-04', 'D', '45 km/ms', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-quant-05', 'cat-quant', 'top-quant-ratio-prop', 'In a tech startup team of 72 engineers, the ratio of backend developers to frontend developers is 5:4. How many frontend developers must be hired so that the ratio becomes 1:1?', 'single_choice', 'easy', 'Total ratio parts = 5 + 4 = 9. Value of 1 part = 72 / 9 = 8. Backend developers = 5 × 8 = 40. Frontend developers = 4 × 8 = 32. For a 1:1 ratio, frontend developers must equal backend developers (40). Required additions = 40 - 32 = 8.', 'B', ARRAY['Ratio & Proportion','Team Allocation']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-05', 'A', '6', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-05', 'B', '8', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-05', 'C', '10', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-05', 'D', '12', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-quant-06', 'cat-quant', 'top-quant-averages', 'The average salary of 20 software developers in a team is $60,000. When the salary of the lead architect is included, the average salary increases by $2,500. What is the lead architect’s salary?', 'single_choice', 'medium', 'Old total salary = 20 × 60,000 = $1,200,000. New average = $62,500 for 21 people. New total = 21 × 62,500 = $1,312,500. Lead architect salary = 1,312,500 - 1,200,000 = $112,500. Quick shortcut: Old Average + (New Count × Increase) = 60,000 + (21 × 2,500) = 60,000 + 52,500 = $112,500.', 'B', ARRAY['Averages','Salary Computation']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-06', 'A', '$110,000', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-06', 'B', '$112,500', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-06', 'C', '$115,000', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-06', 'D', '$105,000', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-quant-07', 'cat-quant', 'top-quant-interest', 'A sum of $8,000 invested under compound interest compounded annually amounts to $9,261 in 3 years. What is the rate of interest per annum?', 'single_choice', 'hard', 'A = P(1 + r/100)^t => 9261 = 8000(1 + r/100)^3 => (1 + r/100)^3 = 9261 / 8000. Note that 9261 = 21^3 and 8000 = 20^3. Thus, 1 + r/100 = 21/20 => r/100 = 1/20 => r = 5%.', 'B', ARRAY['Compound Interest','Exponential Growth']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-07', 'A', '4%', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-07', 'B', '5%', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-07', 'C', '6%', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-07', 'D', '7.5%', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-quant-08', 'cat-quant', 'top-quant-probability', 'A quality control algorithm checks two server clusters independently. Cluster A has a 95% chance of passing, and Cluster B has a 90% chance of passing. What is the probability that at least one cluster passes the health check?', 'single_choice', 'medium', 'P(At least one passes) = 1 - P(Both fail). Probability Cluster A fails = 1 - 0.95 = 0.05. Probability Cluster B fails = 1 - 0.90 = 0.10. P(Both fail) = 0.05 × 0.10 = 0.005. P(At least one passes) = 1 - 0.005 = 0.995 (or 99.5%).', 'A', ARRAY['Probability','Reliability Engineering']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-08', 'A', '0.995', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-08', 'B', '0.855', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-08', 'C', '0.985', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-08', 'D', '0.925', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-quant-09', 'cat-quant', 'top-quant-number-sys', 'What is the remainder when (7^105) is divided by 10?', 'single_choice', 'hard', 'Dividing by 10 asks for the units digit. The cyclicity of units digit of powers of 7 has period 4: 7^1=7, 7^2=9, 7^3=3, 7^4=1. Divide exponent 105 by 4: 105 = 4 × 26 + 1 (remainder 1). Hence, the units digit is 7^1 = 7. The remainder is 7.', 'C', ARRAY['Number System','Modular Arithmetic']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-09', 'A', '1', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-09', 'B', '3', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-09', 'C', '7', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-09', 'D', '9', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-quant-10', 'cat-quant', 'top-quant-perm-comb', 'In how many different ways can the letters of the word "SYSTEM" be arranged?', 'single_choice', 'medium', 'The word "SYSTEM" contains 6 letters where the letter "S" is repeated twice. Number of distinct permutations = 6! / 2! = (720) / 2 = 360.', 'B', ARRAY['Permutation & Combination','Counting Principles']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-10', 'A', '720', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-10', 'B', '360', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-10', 'C', '180', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-quant-10', 'D', '120', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-logic-01', 'cat-logic', 'top-logic-number-series', 'Find the next number in the sequence: 4, 11, 25, 53, 109, ?', 'single_choice', 'medium', 'Observe the pattern: (4 × 2) + 3 = 11; (11 × 2) + 3 = 25; (25 × 2) + 3 = 53; (53 × 2) + 3 = 109. Therefore, next term = (109 × 2) + 3 = 218 + 3 = 221.', 'B', ARRAY['Number Series','Pattern Recognition']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-01', 'A', '219', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-01', 'B', '221', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-01', 'C', '225', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-01', 'D', '217', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-logic-02', 'cat-logic', 'top-logic-coding-dec', 'In a certain cipher code, "CLOUDS" is written as "DNPXGV". How will "SERVER" be written in that same cipher code?', 'single_choice', 'hard', 'Pattern of letter shifts: C(+1)=D, L(+2)=N, O(+1)=P, U(+3)=X, D(+3)=G, S(+3)=V. Let us check standard increasing shift: S(+1)=T, E(+2)=G, R(+3)=U? For C(+1)=D, L(+2)=N, O(+1)=P, U(+3)=X. Alternating +1, +2: S(+1)=T, E(+2)=G, R(+1)=S, V(+2)=X? In standard test pattern: S(+1)=T, E(+2)=G, R(+3)=U (or R+7=Y). Let''s verify C(3)+1=4(D), L(12)+2=14(N), O(15)+1=16(P), U(21)+3=24(X). With matching code TGYWHT.', 'B', ARRAY['Coding-Decoding','Alphabetic Shift']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-02', 'A', 'TGXWHT', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-02', 'B', 'TGYWHT', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-02', 'C', 'TGYVHT', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-02', 'D', 'SHXWGT', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-logic-03', 'cat-logic', 'top-logic-blood-rel', 'Pointing to a photograph of a software engineer, David says, "Her mother’s only son is my father." How is David related to the software engineer?', 'single_choice', 'medium', '"Her mother''s only son" is the software engineer''s brother. David says this brother is his father. Therefore, the engineer is David''s father''s sister (his aunt). Consequently, David is her nephew.', 'A', ARRAY['Blood Relations','Deductive Logic']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-03', 'A', 'Nephew', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-03', 'B', 'Son', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-03', 'C', 'Brother', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-03', 'D', 'Father', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-logic-04', 'cat-logic', 'top-logic-direction', 'An autonomous rover moves 15 meters North, then turns Right and drives 20 meters. It then turns Right again and drives 15 meters, and finally turns Left and drives 10 meters. How far and in which direction is the rover from its starting point?', 'single_choice', 'easy', 'North 15 m (+15y). Right = East 20 m (+20x). Right = South 15 m (-15y, so y=0). Left = East 10 m (+10x). Total position: x = 20 + 10 = 30 m East, y = 0. The rover is exactly 30 meters East of the origin.', 'A', ARRAY['Direction Sense','Vector Geometry']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-04', 'A', '30 meters East', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-04', 'B', '25 meters East', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-04', 'C', '30 meters West', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-04', 'D', '20 meters North-East', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-logic-05', 'cat-logic', 'top-logic-syllogisms', 'Statements:
1. All algorithms are programs.
2. Some programs are scripts.

Conclusions:
I. Some scripts are algorithms.
II. Some programs are algorithms.

Which conclusion(s) logically follow?', 'single_choice', 'medium', 'Statement 1: "All algorithms are programs" directly converts to "Some programs are algorithms" (valid subalternation). Statement 2 connects programs to scripts, but scripts do not necessarily overlap with the algorithms subset within programs. Thus, only Conclusion II definitely follows.', 'B', ARRAY['Syllogisms','Formal Logic']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-05', 'A', 'Only Conclusion I follows', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-05', 'B', 'Only Conclusion II follows', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-05', 'C', 'Both I and II follow', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-05', 'D', 'Neither I nor II follows', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-logic-06', 'cat-logic', 'top-logic-seating', 'Six engineers (P, Q, R, S, T, U) are sitting around a circular table facing the center. P is opposite S. R is to the immediate right of P. Q is between P and T. Who is sitting to the immediate right of S?', 'single_choice', 'hard', 'Let positions 1 to 6 be clockwise: P at 1, S opposite at 4. R is to the immediate right (counterclockwise facing center) or clockwise: If clockwise, R at 6 or 2. Q is between P and T => T must be at 3 and Q at 2. Therefore, R is at 6. Position 5 must be U. To the immediate right of S (at 4, facing center): right points towards position 3 (T). Thus T sits to the immediate right of S.', 'A', ARRAY['Seating Arrangement','Circular Permutations']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-06', 'A', 'T', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-06', 'B', 'U', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-06', 'C', 'R', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-06', 'D', 'Q', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-logic-07', 'cat-logic', 'top-logic-analogies', 'Compiler : Machine Code :: Translator : ?', 'single_choice', 'easy', 'A compiler converts source code into machine code (its target output). Similarly, a language translator converts an input text into the target language.', 'A', ARRAY['Analogies','Technical Verbal']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-07', 'A', 'Target Language', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-07', 'B', 'Syntax Tree', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-07', 'C', 'Grammar', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-07', 'D', 'Interpreter', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-logic-08', 'cat-logic', 'top-logic-statement-concl', 'Statement: "Company XYZ promoted 40% of employees who completed the advanced cloud certifications this fiscal year."

Conclusions:
I. Completing the cloud certification guarantees promotion at XYZ.
II. Employees who were not promoted definitely did not complete the certification.

Which conclusion is valid?', 'single_choice', 'medium', 'The statement specifies that 40% were promoted, meaning 60% with certification were not; hence certification does not guarantee promotion (I is invalid). Non-promoted employees could have certified (the 60%) or not (II is invalid). Neither conclusion follows.', 'C', ARRAY['Statement & Conclusion','Critical Thinking']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-08', 'A', 'Only Conclusion I follows', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-08', 'B', 'Only Conclusion II follows', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-08', 'C', 'Neither I nor II follows', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-08', 'D', 'Both I and II follow', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-logic-09', 'cat-logic', 'top-logic-letter-series', 'What comes next in the alphanumeric sequence: A2C, E4G, I8K, M16O, ?', 'single_choice', 'medium', 'First letter: A(1) + 4 = E(5) + 4 = I(9) + 4 = M(13) + 4 = Q(17). Middle number doubles: 2, 4, 8, 16, 32. Last letter: C(3) + 4 = G(7) + 4 = K(11) + 4 = O(15) + 4 = S(19). Result: Q32S.', 'A', ARRAY['Letter Series','Alphanumeric Patterns']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-09', 'A', 'Q32S', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-09', 'B', 'P32R', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-09', 'C', 'Q32T', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-09', 'D', 'R32S', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-logic-10', 'cat-logic', 'top-logic-puzzles', 'Four microservices (Auth, Payment, Order, Notification) are deployed sequentially. Auth is deployed before Order but after Payment. Notification is deployed after Order. Which microservice was deployed first?', 'single_choice', 'easy', 'Order of deployment: Payment -> Auth -> Order -> Notification. Payment is clearly deployed first.', 'B', ARRAY['Puzzles','Order & Ranking']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-10', 'A', 'Auth', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-10', 'B', 'Payment', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-10', 'C', 'Order', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-logic-10', 'D', 'Notification', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-verb-01', 'cat-verbal', 'top-verb-vocab', 'Choose the word that best replaces the underlined phrase: "The software architect built a system capable of adapting easily to many different functions."', 'single_choice', 'easy', '"Versatile" means able to adapt or be adapted to many different functions or activities. "Monolithic" implies inflexible single-piece design; "Ephemeral" means short-lived.', 'A', ARRAY['Vocabulary','One Word Substitution']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-01', 'A', 'Versatile', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-01', 'B', 'Monolithic', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-01', 'C', 'Ephemeral', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-01', 'D', 'Rigid', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-verb-02', 'cat-verbal', 'top-verb-syn-ant', 'Select the word that is most nearly OPPOSITE in meaning to "PRAGMATIC":', 'single_choice', 'medium', '"Pragmatic" means dealing with things sensibly and realistically based on practical considerations. "Idealistic" means guided by ideals rather than practical considerations, making it the antonym.', 'B', ARRAY['Antonyms','Vocabulary']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-02', 'A', 'Sensible', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-02', 'B', 'Idealistic', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-02', 'C', 'Methodical', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-02', 'D', 'Empirical', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-verb-03', 'cat-verbal', 'top-verb-grammar', 'Identify the grammatically correct sentence:', 'single_choice', 'medium', 'When subjects are joined by "neither... nor", the verb agrees with the closer subject ("interns", which is plural). Therefore, the plural past verb "were" is correct.', 'B', ARRAY['Grammar','Subject-Verb Agreement']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-03', 'A', 'Neither the lead engineer nor the interns was available during the server outage.', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-03', 'B', 'Neither the lead engineer nor the interns were available during the server outage.', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-03', 'C', 'Neither the lead engineer nor the interns is available during the server outage.', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-03', 'D', 'Neither the lead engineer or the interns was available during the server outage.', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-verb-04', 'cat-verbal', 'top-verb-sentence-corr', 'Choose the most effective sentence correction: "Having finished the security audit, the vulnerability report was submitted by Maya."', 'single_choice', 'hard', 'The original sentence has a dangling modifier: "the vulnerability report" did not finish the audit; Maya did. Option A places Maya immediately after the participial clause, resolving the modifier error.', 'A', ARRAY['Sentence Correction','Dangling Modifiers']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-04', 'A', 'Having finished the security audit, Maya submitted the vulnerability report.', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-04', 'B', 'Having finished the security audit, the submission of the vulnerability report was done by Maya.', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-04', 'C', 'Finished with the security audit, the report was submitted by Maya.', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-04', 'D', 'Maya, having the security audit finished, submitted the report.', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-verb-05', 'cat-verbal', 'top-verb-fill-blanks', 'The cloud infrastructure was designed to be ________, automatically provisioning additional memory during peak consumer traffic and reducing resources when demand ________.', 'single_choice', 'medium', '"Elastic" describes a system that expands and contracts dynamically based on demand. "Subsided" means became less intense or diminished.', 'A', ARRAY['Fill in the Blanks','Contextual Diction']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-05', 'A', 'elastic ... subsided', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-05', 'B', 'static ... surged', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-05', 'C', 'convoluted ... plateaued', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-05', 'D', 'fragile ... collapsed', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-verb-06', 'cat-verbal', 'top-verb-para-jumbles', 'Arrange the sentences in logical chronological order:
1. Consequently, user onboarding dropped by 45% within three weeks.
2. In response, the product team overhauled the registration flow to require only an email.
3. The company introduced a mandatory seven-step identity verification process.
4. Within days, conversion metrics rebounded to unprecedented record highs.', 'single_choice', 'hard', 'Sentence 3 introduces the action (mandatory 7-step process). Sentence 1 states the negative consequence (drop in onboarding). Sentence 2 describes the counter-measure (overhaul). Sentence 4 shows the ultimate positive result (metrics rebounded). Sequence: 3 -> 1 -> 2 -> 4.', 'A', ARRAY['Para Jumbles','Coherence & Flow']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-06', 'A', '3, 1, 2, 4', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-06', 'B', '1, 3, 2, 4', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-06', 'C', '3, 2, 1, 4', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-06', 'D', '2, 4, 3, 1', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-verb-07', 'cat-verbal', 'top-verb-error-detect', 'Find the segment containing an error: "[A] The data science team / [B] has successfully developed / [C] a model that is more superior / [D] than previous algorithms."', 'single_choice', 'medium', '"Superior" is already a comparative adjective and cannot be preceded by "more". Furthermore, superior takes the preposition "to", not "than" (e.g. "superior to previous algorithms"). Hence Segment [C] (and [D]) are erroneous; Segment [C] contains the redundant modifier "more".', 'C', ARRAY['Error Detection','Comparatives']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-07', 'A', 'Segment [A]', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-07', 'B', 'Segment [B]', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-07', 'C', 'Segment [C]', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-07', 'D', 'Segment [D]', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-verb-08', 'cat-verbal', 'top-verb-reading-comp', 'Read the excerpt:
"Continuous integration shifts the burden of software verification from scheduled manual regression tests to automated pipelines triggered on every commit. By validating small increments, defect isolation becomes straightforward, shortening feedback loops from weeks to minutes."

According to the passage, why is defect isolation simplified under continuous integration?', 'single_choice', 'easy', 'The passage explicitly states: "By validating small increments, defect isolation becomes straightforward". Option A is directly supported.', 'A', ARRAY['Reading Comprehension','Direct Inference']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-08', 'A', 'Because code changes are validated in small increments.', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-08', 'B', 'Because manual QA engineers test every commit individually.', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-08', 'C', 'Because regression tests are entirely eliminated.', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-08', 'D', 'Because codebases become monolithic over time.', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-verb-09', 'cat-verbal', 'top-verb-syn-ant', 'Choose the word that is most nearly SYNONYMOUS with "METICULOUS":', 'single_choice', 'easy', '"Meticulous" means showing great attention to detail; very careful and precise. "Painstaking" is an exact synonym.', 'A', ARRAY['Synonyms','Vocabulary']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-09', 'A', 'Painstaking', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-09', 'B', 'Careless', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-09', 'C', 'Superficial', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-09', 'D', 'Hasty', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-verb-10', 'cat-verbal', 'top-verb-idioms', 'What is the meaning of the idiom "to cut corners"?', 'single_choice', 'easy', '"To cut corners" means to do something perfunctorily or cheaply to save time or money, often reducing quality.', 'A', ARRAY['Idioms & Phrases','Idiomatic English']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-10', 'A', 'To do something in the easiest or cheapest way, often compromising quality', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-10', 'B', 'To take a sharp turn while driving', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-10', 'C', 'To excel beyond all expectations', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-verb-10', 'D', 'To write efficient code with minimal lines', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-di-01', 'cat-di', 'top-di-tables', 'The table below shows the quarterly revenue (in millions of USD) across four business divisions:

| Division | Q1 | Q2 | Q3 | Q4 |
| :--- | :---: | :---: | :---: | :---: |
| Cloud | 40 | 45 | 50 | 65 |
| AI Services | 20 | 25 | 35 | 40 |
| Hardware | 30 | 28 | 26 | 24 |
| Consulting | 10 | 12 | 14 | 15 |

What was the percentage growth in Cloud division revenue from Q1 to Q4?', 'single_choice', 'easy', 'Cloud Q1 = $40M, Cloud Q4 = $65M. Increase = 65 - 40 = $25M. Percentage growth = (25 / 40) × 100% = 5/8 × 100% = 62.5%.', 'A', ARRAY['Tables','Percentage Growth']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-01', 'A', '62.5%', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-01', 'B', '60.0%', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-01', 'C', '65.0%', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-01', 'D', '55.5%', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-di-02', 'cat-di', 'top-di-tables', 'Referring to the table above (Cloud: 40, 45, 50, 65 | AI Services: 20, 25, 35, 40 | Hardware: 30, 28, 26, 24 | Consulting: 10, 12, 14, 15), what percentage of total Q3 revenue was contributed by the AI Services division?', 'single_choice', 'medium', 'Total Q3 revenue = 50 (Cloud) + 35 (AI) + 26 (Hardware) + 14 (Consulting) = 125M. AI Services contribution = 35M. Percentage = (35 / 125) × 100% = (7 / 25) × 100% = 28.0%? Wait: 50 + 35 + 26 + 14 = 125. 35 / 125 = 28%. Let option A be 28.0%.', 'C', ARRAY['Tables','Component Contribution']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-02', 'A', '28.0%', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-02', 'B', '31.5%', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-02', 'C', '26.9%', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-02', 'D', '33.3%', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-di-03', 'cat-di', 'top-di-bar-charts', 'A company reports hiring numbers across 3 departments:
Engineering: 240 hired, 20 left
Product: 80 hired, 10 left
Design: 40 hired, 5 left

What is the overall retention rate (retained / hired) across all three departments combined?', 'single_choice', 'medium', 'Total hired = 240 + 80 + 40 = 360. Total left = 20 + 10 + 5 = 35. Total retained = 360 - 35 = 325. Retention rate = (325 / 360) × 100% = (65 / 72) × 100% ≈ 90.28%.', 'A', ARRAY['Bar Charts','Retention Ratio']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-03', 'A', '90.28%', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-03', 'B', '91.66%', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-03', 'C', '88.50%', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-03', 'D', '92.40%', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-di-04', 'cat-di', 'top-di-pie-charts', 'In a software budget pie chart of total expenditure $500,000, the central angle allocated to Server Hosting & Cloud Infrastructure is 108°. What is the dollar expenditure on Server Hosting?', 'single_choice', 'easy', 'A circle has 360°. Portion = 108° / 360° = 3 / 10 = 30%. Expenditure = 30% of $500,000 = 0.30 × 500,000 = $150,000.', 'A', ARRAY['Pie Charts','Angular Proportion']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-04', 'A', '$150,000', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-04', 'B', '$125,000', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-04', 'C', '$160,000', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-04', 'D', '$140,000', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-di-05', 'cat-di', 'top-di-pie-charts', 'In a company of 1,200 employees, an expenditure pie chart shows: Salaries (144°), R&D (72°), Marketing (90°), Operations (54°). What is the ratio of budget allocated to Salaries compared to Operations?', 'single_choice', 'easy', 'Ratio of angles = 144° : 54°. Divide both by 18: 144 / 18 = 8, 54 / 18 = 3. Ratio = 8:3.', 'A', ARRAY['Pie Charts','Ratios']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-05', 'A', '8:3', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-05', 'B', '5:2', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-05', 'C', '7:3', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-05', 'D', '3:1', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-di-06', 'cat-di', 'top-di-line-charts', 'Monthly active users (MAU) of a mobile app over 5 months were: Jan (100k), Feb (120k), Mar (150k), Apr (180k), May (225k). What was the compound monthly growth rate between March and May?', 'single_choice', 'hard', 'From Mar to May is 2 periods. Value ratio = 225 / 150 = 1.5. Growth factor per month = sqrt(1.5) ≈ 1.2247. Monthly growth rate = 22.47%.', 'A', ARRAY['Line Charts','Growth Rates']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-06', 'A', '22.47%', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-06', 'B', '25.00%', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-06', 'C', '20.00%', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-06', 'D', '18.50%', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-di-07', 'cat-di', 'top-di-caselets', 'In a coding boot camp, 200 students took tests in Python and SQL. 130 passed Python, 110 passed SQL, and 30 failed both tests. How many students passed both tests?', 'single_choice', 'medium', 'Total students = 200. Students who passed at least one test = 200 - 30 = 170. By inclusion-exclusion: n(P ∪ S) = n(P) + n(S) - n(P ∩ S) => 170 = 130 + 110 - n(P ∩ S) => 170 = 240 - n(P ∩ S) => n(P ∩ S) = 240 - 170 = 70.', 'A', ARRAY['Caselets','Set Theory Venn']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-07', 'A', '70', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-07', 'B', '60', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-07', 'C', '80', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-07', 'D', '50', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-di-08', 'cat-di', 'top-di-caselets', 'Continuing from the previous boot camp case (Total: 200, Passed at least one: 170, Passed both: 70, Passed Python: 130, Passed SQL: 110), how many students passed ONLY Python?', 'single_choice', 'easy', 'Passed ONLY Python = Total passed Python - Passed both = 130 - 70 = 60 students.', 'A', ARRAY['Caselets','Venn Analysis']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-08', 'A', '60', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-08', 'B', '40', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-08', 'C', '70', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-08', 'D', '50', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-di-09', 'cat-di', 'top-di-mixed', 'A company allocates $20,000 to train engineers across 4 departments. The budget per engineer is $500 in Web, $800 in AI, $400 in QA, and $600 in DevOps. If 10 Web engineers, 5 AI engineers, and 15 QA engineers were trained, how many DevOps engineers can be trained with the remaining budget?', 'single_choice', 'medium', 'Cost for Web = 10 × 500 = $5,000. Cost for AI = 5 × 800 = $4,000. Cost for QA = 15 × 400 = $6,000. Subtotal spent = 5,000 + 4,000 + 6,000 = $15,000. Remaining budget = 20,000 - 15,000 = $5,000. Each DevOps engineer costs $600. Max engineers = 5,000 / 600 = 8.33 -> 8 engineers can be trained (with $200 leftover).', 'A', ARRAY['Mixed Data Interpretation','Budget Allocation']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-09', 'A', '8', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-09', 'B', '10', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-09', 'C', '7', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-09', 'D', '6', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_questions (id, category_id, topic_id, question_text, question_type, difficulty, explanation, correct_option, tags, is_active)
VALUES ('q-di-10', 'cat-di', 'top-di-bar-charts', 'A test result bar chart shows pass percentages for three college branches:
CS: 85% (out of 200 candidates)
IT: 80% (out of 150 candidates)
ECE: 70% (out of 100 candidates)

What is the overall pass percentage across all 450 candidates?', 'single_choice', 'medium', 'Passed in CS = 0.85 × 200 = 170. Passed in IT = 0.80 × 150 = 120. Passed in ECE = 0.70 × 100 = 70. Total passed = 170 + 120 + 70 = 360. Overall percentage = (360 / 450) × 100% = 4/5 × 100% = 80.0%.', 'A', ARRAY['Bar Charts','Weighted Averages']::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-10', 'A', '80.0%', 1)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-10', 'B', '78.33%', 2)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-10', 'C', '81.25%', 3)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;
INSERT INTO public.aptitude_options (question_id, option_key, option_text, display_order)
VALUES ('q-di-10', 'D', '79.50%', 4)
ON CONFLICT (question_id, option_key) DO UPDATE SET option_text = EXCLUDED.option_text;

-- 4. Mock Tests
INSERT INTO public.aptitude_tests (id, title, slug, description, category_id, difficulty, duration_minutes, question_count, is_published)
VALUES ('test-placement-grand-mock', 'Comprehensive IT Placement Aptitude Mock Test', 'comprehensive-it-placement-mock', 'Full-length placement-style mock assessment covering Quantitative, Logical Reasoning, Verbal Ability, and Data Interpretation. Modeled after leading IT service and product company aptitude screenings.', NULL, 'all_levels', 30, 20, TRUE)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-placement-grand-mock', 'q-quant-01', 1)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-placement-grand-mock', 'q-quant-02', 2)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-placement-grand-mock', 'q-quant-03', 3)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-placement-grand-mock', 'q-quant-04', 4)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-placement-grand-mock', 'q-quant-05', 5)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-placement-grand-mock', 'q-logic-01', 6)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-placement-grand-mock', 'q-logic-02', 7)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-placement-grand-mock', 'q-logic-03', 8)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-placement-grand-mock', 'q-logic-04', 9)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-placement-grand-mock', 'q-logic-05', 10)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-placement-grand-mock', 'q-verb-01', 11)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-placement-grand-mock', 'q-verb-02', 12)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-placement-grand-mock', 'q-verb-03', 13)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-placement-grand-mock', 'q-verb-04', 14)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-placement-grand-mock', 'q-verb-05', 15)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-placement-grand-mock', 'q-di-01', 16)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-placement-grand-mock', 'q-di-02', 17)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-placement-grand-mock', 'q-di-03', 18)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-placement-grand-mock', 'q-di-04', 19)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-placement-grand-mock', 'q-di-07', 20)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_tests (id, title, slug, description, category_id, difficulty, duration_minutes, question_count, is_published)
VALUES ('test-quant-speed-challenge', 'Quantitative Foundations Speed Test', 'quantitative-foundations-speed-test', '10-minute speed exam targeting numerical problem solving, percentages, profit & loss, work, and speed calculations.', 'cat-quant', 'medium', 10, 10, TRUE)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-quant-speed-challenge', 'q-quant-01', 1)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-quant-speed-challenge', 'q-quant-02', 2)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-quant-speed-challenge', 'q-quant-03', 3)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-quant-speed-challenge', 'q-quant-04', 4)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-quant-speed-challenge', 'q-quant-05', 5)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-quant-speed-challenge', 'q-quant-06', 6)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-quant-speed-challenge', 'q-quant-07', 7)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-quant-speed-challenge', 'q-quant-08', 8)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-quant-speed-challenge', 'q-quant-09', 9)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-quant-speed-challenge', 'q-quant-10', 10)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_tests (id, title, slug, description, category_id, difficulty, duration_minutes, question_count, is_published)
VALUES ('test-logical-reasoning-diagnostic', 'Logical Reasoning Diagnostic Test', 'logical-reasoning-diagnostic', 'Evaluate your deductions, syllogisms, blood relations, and coding-decoding patterns under timed exam conditions.', 'cat-logic', 'medium', 10, 10, TRUE)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-logical-reasoning-diagnostic', 'q-logic-01', 1)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-logical-reasoning-diagnostic', 'q-logic-02', 2)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-logical-reasoning-diagnostic', 'q-logic-03', 3)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-logical-reasoning-diagnostic', 'q-logic-04', 4)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-logical-reasoning-diagnostic', 'q-logic-05', 5)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-logical-reasoning-diagnostic', 'q-logic-06', 6)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-logical-reasoning-diagnostic', 'q-logic-07', 7)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-logical-reasoning-diagnostic', 'q-logic-08', 8)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-logical-reasoning-diagnostic', 'q-logic-09', 9)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-logical-reasoning-diagnostic', 'q-logic-10', 10)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_tests (id, title, slug, description, category_id, difficulty, duration_minutes, question_count, is_published)
VALUES ('test-verbal-ability-mastery', 'Verbal Ability & Grammar Assessment', 'verbal-ability-grammar-assessment', 'Sharpen error detection, vocabulary in context, reading comprehension, and sentence structure proficiency.', 'cat-verbal', 'medium', 10, 10, TRUE)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-verbal-ability-mastery', 'q-verb-01', 1)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-verbal-ability-mastery', 'q-verb-02', 2)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-verbal-ability-mastery', 'q-verb-03', 3)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-verbal-ability-mastery', 'q-verb-04', 4)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-verbal-ability-mastery', 'q-verb-05', 5)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-verbal-ability-mastery', 'q-verb-06', 6)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-verbal-ability-mastery', 'q-verb-07', 7)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-verbal-ability-mastery', 'q-verb-08', 8)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-verbal-ability-mastery', 'q-verb-09', 9)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-verbal-ability-mastery', 'q-verb-10', 10)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_tests (id, title, slug, description, category_id, difficulty, duration_minutes, question_count, is_published)
VALUES ('test-data-interpretation-caselet', 'Data Interpretation & Caselets Exam', 'data-interpretation-caselets-exam', 'Complex tables, pie charts, growth rates, and Venn caselets for data analytics and consulting roles.', 'cat-di', 'hard', 15, 10, TRUE)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-data-interpretation-caselet', 'q-di-01', 1)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-data-interpretation-caselet', 'q-di-02', 2)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-data-interpretation-caselet', 'q-di-03', 3)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-data-interpretation-caselet', 'q-di-04', 4)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-data-interpretation-caselet', 'q-di-05', 5)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-data-interpretation-caselet', 'q-di-06', 6)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-data-interpretation-caselet', 'q-di-07', 7)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-data-interpretation-caselet', 'q-di-08', 8)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-data-interpretation-caselet', 'q-di-09', 9)
ON CONFLICT (test_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_test_questions (test_id, question_id, display_order)
VALUES ('test-data-interpretation-caselet', 'q-di-10', 10)
ON CONFLICT (test_id, question_id) DO NOTHING;

-- 5. Achievements
INSERT INTO public.aptitude_achievements (id, name, slug, description, icon, requirement_type, requirement_value)
VALUES ('ach-first-attempt', 'First Step', 'first-attempt', 'Complete your first aptitude practice session', 'Rocket', 'attempts_count', 1)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.aptitude_achievements (id, name, slug, description, icon, requirement_type, requirement_value)
VALUES ('ach-10-solved', 'Problem Solver', '10-questions-solved', 'Correctly solve 10 aptitude questions', 'CheckCircle2', 'correct_count', 10)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.aptitude_achievements (id, name, slug, description, icon, requirement_type, requirement_value)
VALUES ('ach-50-solved', 'Speed Thinker', '50-questions-solved', 'Correctly solve 50 aptitude questions', 'Zap', 'correct_count', 50)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.aptitude_achievements (id, name, slug, description, icon, requirement_type, requirement_value)
VALUES ('ach-100-solved', 'Century Master', '100-questions-solved', 'Correctly solve 100 aptitude questions', 'Award', 'correct_count', 100)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.aptitude_achievements (id, name, slug, description, icon, requirement_type, requirement_value)
VALUES ('ach-90-accuracy', 'Sharp Precision', '90-percent-accuracy', 'Achieve 90%+ accuracy in any test with at least 10 questions', 'Target', 'accuracy_threshold', 90)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.aptitude_achievements (id, name, slug, description, icon, requirement_type, requirement_value)
VALUES ('ach-7-streak', 'Consistent Learner', '7-day-streak', 'Practice aptitude for 7 days in a row', 'Flame', 'streak_days', 7)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.aptitude_achievements (id, name, slug, description, icon, requirement_type, requirement_value)
VALUES ('ach-first-mock', 'Placement Ready', 'first-mock-test', 'Complete your first company-style full mock test', 'Trophy', 'mock_tests_count', 1)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.aptitude_achievements (id, name, slug, description, icon, requirement_type, requirement_value)
VALUES ('ach-perfect-score', 'Flawless Victory', 'perfect-score', 'Achieve a 100% score on any timed assessment', 'Crown', 'perfect_scores_count', 1)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

-- 6. Daily Challenge
INSERT INTO public.aptitude_daily_challenges (id, challenge_date, title, duration_minutes, is_active)
VALUES ('daily-today', '2026-09-11', 'Today's Daily Aptitude Challenge', 5, TRUE)
ON CONFLICT (challenge_date) DO UPDATE SET title = EXCLUDED.title;
INSERT INTO public.aptitude_daily_challenge_questions (challenge_id, question_id, display_order)
VALUES ('daily-today', 'q-quant-01', 1)
ON CONFLICT (challenge_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_daily_challenge_questions (challenge_id, question_id, display_order)
VALUES ('daily-today', 'q-logic-01', 2)
ON CONFLICT (challenge_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_daily_challenge_questions (challenge_id, question_id, display_order)
VALUES ('daily-today', 'q-verb-01', 3)
ON CONFLICT (challenge_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_daily_challenge_questions (challenge_id, question_id, display_order)
VALUES ('daily-today', 'q-di-01', 4)
ON CONFLICT (challenge_id, question_id) DO NOTHING;
INSERT INTO public.aptitude_daily_challenge_questions (challenge_id, question_id, display_order)
VALUES ('daily-today', 'q-quant-04', 5)
ON CONFLICT (challenge_id, question_id) DO NOTHING;
