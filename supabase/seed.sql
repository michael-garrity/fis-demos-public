-- Seed fake_learner_profiles
insert into fake_learner_profiles
(label, age, reading_level, interests)
values
(
    '7th grader', 12, 5,
    array['Robotics', 'Graphic novels', 'Animals']
),
(
    'High school junior', 16, 9,
    array['Basketball', 'Hip-hop production', 'Science fiction']
),
(
    '4th grader', 9, 3,
    array['Dinosaurs', 'Drawing', 'Minecraft']
);

-- Seed source_materials
insert into source_materials
(title, markdown)
values
(
    'What is an Atom?',
    $md$
Atoms are the building blocks of matter. Everything around you — the air,
water, your body — is made of atoms. Scientists discovered that atoms are
incredibly small and consist of even smaller parts: **protons**, **neutrons**,
and **electrons**.

- **Protons** have a positive charge and sit in the center, called the **nucleus**.
- **Neutrons** have no charge and are also in the nucleus.
- **Electrons** have a negative charge and orbit around the nucleus.

Learning about atoms helps us understand chemistry, biology, and physics.
For example, how water molecules form, how chemical reactions occur, and why
different materials behave differently all depend on atoms.
$md$
),
(
    'The Water Cycle',
    $md$
Water is always moving around the Earth in a process called the **water cycle**.
It has four main stages:

1. **Evaporation**: Water turns into vapor and rises into the sky.
2. **Condensation**: Water vapor forms clouds.
3. **Precipitation**: Water falls as rain, snow, or hail.
4. **Collection**: Water gathers in rivers, lakes, and oceans.

The water cycle ensures that fresh water is constantly renewed. Understanding
this cycle helps students see why water conservation is important.
$md$
),
(
    'Simple Machines: Making Work Easier',
    $md$
A **simple machine** is a tool that makes work easier by changing the direction or size of a force. There are six types:

1. Lever
2. Wheel and axle
3. Pulley
4. Inclined plane
5. Wedge
6. Screw

Example: Using a ramp (inclined plane) to move a heavy box requires less force than lifting it straight up. Learning about simple machines helps students understand mechanics and physics in everyday life.
$md$
);
