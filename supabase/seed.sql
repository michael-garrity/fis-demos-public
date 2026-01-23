-- Seed learner_profiles
insert into learner_profiles
(label, age, reading_level, experience, interests)
values
(
    'Adult Learner', 29, 13,
    $experience$
Has a mechanical engineering degree and has some coding experience from coding bootcamps.
$experience$,
    array['3D printing', 'Mountain biking', 'Pottery']
),
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
),
(
  'Seaborn: Python Data Visualization',
    $md$
Seaborn is a popular Python data visualization library built on top of Matplotlib. It provides a high-level interface for creating attractive and informative statistical graphics. Seaborn aims to make it easy to create complex visualizations with just a few lines of code, while still allowing for deep customization.

### Built on Matplotlib with Beautiful Default Styles:
Seaborn is built on Matplotlib, providing a high-level interface for drawing attractive and informative statistical graphics. It comes with several built-in themes and color palettes that make creating visually appealing plots straightforward.
### Statistical Functions and High-Level Abstraction:
It includes built-in statistical functions for creating complex visualizations and provides high-level functions for common plot types like bar plots, violin plots, and scatter plots, making it accessible for beginners and powerful for advanced users.
### DataFrame Support and Faceted Plots:
Seaborn works seamlessly with Pandas DataFrames, allowing for direct plotting from DataFrames. It simplifies the creation of faceted plots, which show different subsets of data side by side, useful for comparing distributions across subsets.
### Customizability and Integration with Matplotlib:
While Seaborn’s default settings are designed for quick and easy visualizations, it allows extensive customization. Seaborn plots can be fine-tuned using Matplotlib commands, providing additional flexibility.
### User-Friendly and Practical:
Designed to be user-friendly, Seaborn’s features and functionalities are practical for everyday data analysis tasks, helping users uncover patterns and insights efficiently.

## Seaborn vs. Matplotlib

Below are some comparisons and differences between Matplotlib and Seaborn. 

### Ease of Use and Aesthetics
Seaborn: Provides high-level interfaces and beautiful default styles, making it easier to create complex and aesthetically pleasing plots with less code.

Matplotlib: Requires more code and customization to achieve the same level of aesthetics and complexity. It is more flexible but less intuitive for beginners.

### Statistical Plotting
Seaborn: Includes built-in support for statistical plots such as regression plots, box plots, and violin plots. It simplifies the process of visualizing statistical relationships.

Matplotlib: Does not have built-in statistical plotting functions. Users need to manually create these plots, which can be more time-consuming and complex.

### Integration with Pandas DataFrames
Seaborn: Works seamlessly with Pandas DataFrames, allowing direct plotting from DataFrame columns. It is designed to handle data structures used in data analysis.

Matplotlib: Requires data to be converted into NumPy arrays or lists for plotting, which can add extra steps when working with Pandas DataFrames.

## How Does Seaborn Work?

### The Code Behind Seaborn

Seaborn is built on top of Matplotlib, leveraging its foundational capabilities to offer a higher-level, more intuitive interface for creating attractive and informative statistical graphics. To use Seaborn effectively, you need to import both Seaborn and Matplotlib packages. Seaborn’s documentation provides extensive information on various customizations and functionalities, allowing users to tailor their visualizations to specific needs and aesthetic preferences.

Below is the coding cell that imports both the Matplotlib and Seaborn packages. Note that the industry standard alias for the Seaborn package is sns.

```python
import seaborn as sns
import matplotlib.pyplot as plt
```

After importing the Seaborn package, you can refer to the table below to choose the right command based on the type of visual you are creating. Examples of Seaborn

The examples below use several built-in data frames that can be loaded within a Python notebook (you do not need to upload a data file!).

### Simple Univariate Boxplot

Below is a boxplot of a single continuous numeric variable, total_bill amount. This visual can show the spread of the data within that column and a statistical summary (with the median being the center bold line).

```python
import seaborn as sns

tips = sns.load_dataset('tips') # Seaborn comes prepackaged with several different datasets that are great for visualizing!

boxplot = sns.boxplot(data=tips["total_bill"])
```

Boxplot of a single continuous numeric variable, total_bill amount 

### Boxplot Grouped by Categorical Variable

This boxplot can further be broken down into a single boxplot for each day of the week. What main takeaway do you gather about the total bill amount across each day of the week?

```python
sns.boxplot(x="day", y="total_bill", data=tips)
```

Data grouped by categorical variable and broken down into a single boxplot for each day of the week.

### Scatter plot

Using the same tips dataset above let’s make a scatterplot.

```python
import seaborn as sns 
import matplotlib.pyplot as plt


# Load the built-in 'tips' dataset
tips = sns.load_dataset('tips')

# Create a scatter plot
plt.figure(figsize=(10, 6)) 
sns.scatterplot(data=tips, x='total_bill', y='tip')
plt.title('Scatter Plot of Total Bill vs. Tip')
plt.xlabel('Total Bill')
plt.ylabel('Tip')
plt.show()
```
## Conceptualization: 
### Seaborn Commands
Seaborn plot type with description and command Plot Type Seaborn Command Description 
#### Scatter Plot 
- sns.scatterplot()
- Creates a scatter plot to visualize the relationship between two continuous variables. 
#### Line Plot 
- sns.lineplot()
- Creates a line plot to visualize the trend of a continuous variable over a categorical variable. 
#### Bar Plot
- sns.barplot()
- Creates a bar plot to compare categorical variables. 
#### Count Plot
- sns.countplot()
- Creates a bar plot to show the count of observations in each category.
#### Box Plot
- sns.boxplot()
- Creates a box plot to visualize the distribution of a continuous variable across categories.
#### Violin Plot 
- sns.violinplot()
- Creates a violin plot to visualize the distribution of a continuous variable across categories, showing the probability density.
### Strip Plot
- sns.stripplot()
- Creates a scatter plot where one variable is categorical, showing the individual observations.
### Swarm Plot
- sns.swarmplot()
- Similar to a strip plot, but the points are adjusted to avoid overlapping.
### Histogram
- sns.histplot()
- Creates a histogram to visualize the distribution of a single continuous variable.
### Kernel Density Estimation (KDE) Plot 
-sns.kdeplot()
- Creates a smooth estimate of the univariate or bivariate distribution using kernel density estimation.
### Heatmap sns
-.heatmap()
- Creates a heatmap to visualize a matrix of values as colors.
### Pair Plot
- sns.pairplot()
- Creates a grid of scatter plots to visualize pairwise relationships in a dataset.
### Joint Plot
- sns.jointplot()
- Creates a plot that combines a scatter plot and marginal univariate distributions (histogram or KDE).
### Facet Grid
- sns.FacetGrid()
- Creates a grid of plots based on different subsets of the data, useful for visualizing relationships across multiple variables.
### Regression Plot
- sns.regplot()
- Creates a scatter plot with a regression line to visualize the relationship between two variables.
### Residual Plot
- sns.residplot()
- Creates a plot to visualize the residuals of a linear regression model.
### Category Plot
- sns.catplot()
- A figure-level function that creates a grid of plots based on categorical variables, using various plot types (e.g., bar, box, violin).
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

-- Seed personalized_content
insert into personalized_contents
(title, description, creation_meta, content)
values
(
    'Introduction to Atoms',
    $description$
This lesson introduces 7th-grade learners to atoms as the basic building blocks of matter by explaining subatomic particles and atomic structure using clear, age-appropriate language and concrete examples to support foundational understanding in physical science.
$description$,
    $creation_meta$
{
  "source_material": {
    "title": "What is an atom?",
    "markdown": "Atoms are the building blocks of matter. Everything around you — the air, water, your body — is made of atoms. Scientists discovered that atoms are incredibly small and consist of even smaller parts: **protons**, **neutrons**, and **electrons**.\n- **Protons** have a positive charge and sit in the center, called the **nucleus**.\n- **Neutrons** have no charge and are also in the nucleus.\n- **Electrons** have a negative charge and orbit around the nucleus.\nLearning about atoms helps us understand chemistry, biology, and physics.\nFor example, how water molecules form, how chemical reactions occur, and why different materials behave differently all depend on atoms."
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
    $content$
Atoms are the smallest building blocks of matter. Everything around you—air, water, plants, animals, and your own body—is made of atoms. They are extremely small, but they make up everything you can see and touch.

Each atom is made of even smaller parts:
• Protons have a positive (+) charge and are found in the center of the atom, called the nucleus.
• Neutrons have no charge and are also in the nucleus.
• Electrons have a negative (–) charge and move around the nucleus.

Atoms can join together to form molecules. For example, water is made from atoms of hydrogen and oxygen bonded together. The way atoms are arranged and interact explains why different materials behave differently.

Learning about atoms helps us understand chemistry, biology, and physics—from how chemical reactions happen to how living things are built from tiny parts.
$content$
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
    "answers": [
      {
        "text": "An atom has protons and neutrons in the nucleus, with electrons orbiting around it.",
        "feedback": "Correct! The nucleus contains protons and neutrons, while electrons move around the nucleus.",
        "correct": true
      },
      {
        "text": "An atom is made only of protons and electrons, which are both in the nucleus.",
        "feedback": "Not quite. Neutrons are also in the nucleus, and electrons orbit around it.",
        "correct": false
      },
      {
        "text": "An atom is a large solid sphere made entirely of electrons.",
        "feedback": "Incorrect. Atoms are mostly empty space and have a nucleus with protons and neutrons.",
        "correct": false
      },
      {
        "text": "An atom has neutrons orbiting the nucleus while protons and electrons stay in the center.",
        "feedback": "Nope. Only electrons orbit the nucleus; protons and neutrons are in the center.",
        "correct": false
      }
    ]
  }
]
$questions$
);

-- Seed lesson_plans
insert into lesson_plans
(
    creation_meta,
    introduction,
    context,
    example,
    practice,
    assessment,
    reflection
)
values
(
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

    $intro$
  Atoms are the tiny building blocks that make up everything around us.
  $intro$,

    $context$
  Atoms contain protons and neutrons in the nucleus, with electrons moving around it.
  $context$,

    $example$
  Water is made of atoms that combine to form molecules with specific properties.
  $example$,

    $practice$
  - Name the three subatomic particles  
  - Identify which ones are in the nucleus
  $practice$,

    $assessment$
  1. What is an atom?
  2. Which particle has a negative charge?
  $assessment$,

    $reflection$
  Why is understanding atoms important for science?
  $reflection$
);
