-- Seed learner_profiles
insert into learner_profiles
(label, age, reading_level, experience, interests)
values
(
    '7th grader', 12, 5,
    $experience$
Has completed introductory STEM activities and basic robotics challenges.
$experience$,
    array['Robotics', 'Graphic novels', 'Animals']
),
(
    'High school junior', 16, 9,
    $experience$
Has taken several high-school science courses and completed independent creative projects.
$experience$,
    array['Basketball', 'Hip-hop production', 'Science fiction']
),
(
    '4th grader', 9, 3,
    $experience$
Has explored early elementary science units and enjoys hands-on learning projects.
$experience$,
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

-- Seed course_outlines
insert into course_outlines
(title, description, creation_meta, lesson_outlines)
values
(
    'Introduction to Atoms',
    $description$
This course provides instructors with a structured framework to teach students about the fundamental building blocks of matter: atoms. Instructors will guide students from the broad concept of matter to the detailed structure of atoms, exploring subatomic particles, their properties, and how atomic arrangements influence real-world phenomena. The course emphasizes clear, conceptual explanations and practical examples to help students connect atomic theory to everyday experiences and scientific observations.
$description$,
    $creation_meta$
{
  "source_material": {
    "title": "What is an atom?",
    "content": "Atoms are the building blocks of matter. Everything around you — the air, water, your body — is made of atoms. Scientists discovered that atoms are incredibly small and consist of even smaller parts: **protons**, **neutrons**, and **electrons**.\n- **Protons** have a positive charge and sit in the center, called the **nucleus**.\n- **Neutrons** have no charge and are also in the nucleus.\n- **Electrons** have a negative charge and orbit around the nucleus.\nLearning about atoms helps us understand chemistry, biology, and physics.\nFor example, how water molecules form, how chemical reactions occur, and why different materials behave differently all depend on atoms."
  },
  "learner_profile": {
    "label": "7th grader",
    "age": 12,
    "reading_level": 5,
    "experience": "Has completed introductory STEM activities and basic robotics challenges.",
    "interests": ["Robotics", "Graphic novels", "Animals"]
  }
}
$creation_meta$,
    $lesson_outlines$
[
  {
    "title": "What Is Matter Made Of?",
    "outcome": "Students understand that atoms are the basic building blocks of all matter and can identify everyday examples that rely on atoms.",
    "description": "Introduce the concept of matter and explain that everything is made of atoms. Establish scale and smallness, preparing students to explore atomic structure in detail.",
    "minutes": 15
  },
  {
    "title": "Inside the Atom",
    "outcome": "Students can describe the three main subatomic particles and their roles: protons, neutrons, and electrons.",
    "description": "Break down the structure of an atom, focusing on the nucleus (protons and neutrons) and electron orbits. Highlight charges and placement of each particle.",
    "minutes": 15
  },
  {
    "title": "Why Structure Matters",
    "outcome": "Students understand how the arrangement and charges of subatomic particles influence atomic behavior.",
    "description": "Connect particle properties to atomic stability, bonding, and interactions. Use conceptual models to show why electrons orbit and how charge affects behavior.",
    "minutes": 15
  },
  {
    "title": "Atoms in the Real World",
    "outcome": "Students can explain how atoms relate to real scientific phenomena such as molecules, reactions, and material differences.",
    "description": "Apply atomic concepts to chemistry and everyday examples. Introduce molecules, chemical reactions, and why different materials behave differently based on atomic structure.",
    "minutes": 15
  }
]
$lesson_outlines$
);

-- Seed quizzes
insert into quizzes
(title, description, creation_meta, questions)
values
(
    'Introduction to Atoms Quiz',
    $description$
This course provides instructors with a structured framework to teach students about the fundamental building blocks of matter: atoms. Instructors will guide students from the broad concept of matter to the detailed structure of atoms, exploring subatomic particles, their properties, and how atomic arrangements influence real-world phenomena. The course emphasizes clear, conceptual explanations and practical examples to help students connect atomic theory to everyday experiences and scientific observations.
$description$,
    $creation_meta$
{
  "source_material": {
    "title": "What is an atom?",
    "content": "Atoms are the building blocks of matter. Everything around you — the air, water, your body — is made of atoms. Scientists discovered that atoms are incredibly small and consist of even smaller parts: **protons**, **neutrons**, and **electrons**.\n- **Protons** have a positive charge and sit in the center, called the **nucleus**.\n- **Neutrons** have no charge and are also in the nucleus.\n- **Electrons** have a negative charge and orbit around the nucleus.\nLearning about atoms helps us understand chemistry, biology, and physics.\nFor example, how water molecules form, how chemical reactions occur, and why different materials behave differently all depend on atoms."
  },
  "learner_profile": {
    "label": "7th grader",
    "age": 12,
    "reading_level": 5,
    "experience": "Has completed introductory STEM activities and basic robotics challenges.",
    "interests": ["Robotics", "Graphic novels", "Animals"]
  }
}
$creation_meta$,
    $questions$
[
  {
    "question": "Which statement best describes the structure of an atom?",
    "answer": {
      "text": "An atom has protons and neutrons in the nucleus, with electrons orbiting around it.",
      "feedback": "Correct! The nucleus contains protons and neutrons, while electrons move around the nucleus."
    },
    "distractors": [
      {
        "text": "An atom is made only of protons and electrons, which are both in the nucleus.",
        "feedback": "Not quite. Neutrons are also in the nucleus, and electrons orbit around it."
      },
      {
        "text": "An atom is a large solid sphere made entirely of electrons.",
        "feedback": "Incorrect. Atoms are mostly empty space and have a nucleus with protons and neutrons."
      },
      {
        "text": "An atom has neutrons orbiting the nucleus while protons and electrons stay in the center.",
        "feedback": "Nope. Only electrons orbit the nucleus; protons and neutrons are in the center."
      }
    ]
  }
]
$questions$
);
