import type { Difficulty, Equipment, Exercise, MuscleGroup } from '@/lib/types'

/**
 * The exercise library. Every workout on the site references these by id, so a
 * cue written once is correct everywhere. `videoUrl` stays null until the gym
 * uploads its demonstration clips — the UI degrades to a still + cues.
 */

type Seed = {
  id: string
  name: string
  muscleGroup: MuscleGroup
  equipment: Equipment
  difficulty: Difficulty
  instructions: string[]
  substitutions?: string[]
}

function build(seed: Seed): Exercise {
  return {
    id: seed.id,
    slug: seed.id,
    name: seed.name,
    muscleGroup: seed.muscleGroup,
    equipment: seed.equipment,
    difficulty: seed.difficulty,
    instructions: seed.instructions,
    videoUrl: null,
    substitutions: seed.substitutions ?? [],
  }
}

const SEEDS: Seed[] = [
  {
    id: 'back-squat',
    name: 'Barbell Back Squat',
    muscleGroup: 'Legs',
    equipment: 'Full Gym',
    difficulty: 'Intermediate',
    instructions: [
      'Set the bar just below shoulder height and brace it across your upper back, not your neck.',
      'Take a big breath into your belly, brace, and sit down between your hips.',
      'Drive the floor away and finish standing tall — do not lean back at the top.',
    ],
    substitutions: ['Goblet Squat', 'Leg Press', 'Dumbbell Split Squat'],
  },
  {
    id: 'goblet-squat',
    name: 'Goblet Squat',
    muscleGroup: 'Legs',
    equipment: 'Dumbbells',
    difficulty: 'Beginner',
    instructions: [
      'Hold one dumbbell against your chest with both hands under the top plate.',
      'Sit straight down, elbows tracking inside your knees.',
      'Keep your chest proud and stand up without letting the weight drift forward.',
    ],
    substitutions: ['Bodyweight Squat', 'Barbell Back Squat'],
  },
  {
    id: 'front-squat',
    name: 'Front Squat',
    muscleGroup: 'Legs',
    equipment: 'Full Gym',
    difficulty: 'Advanced',
    instructions: [
      'Rack the bar on your front delts with elbows high and fingertips under the bar.',
      'Keep the elbows up throughout — the set ends when they drop.',
      'Sit down vertically and drive up through mid-foot.',
    ],
    substitutions: ['Goblet Squat', 'Barbell Back Squat'],
  },
  {
    id: 'deadlift',
    name: 'Conventional Deadlift',
    muscleGroup: 'Back',
    equipment: 'Full Gym',
    difficulty: 'Intermediate',
    instructions: [
      'Bar over mid-foot, shins close, hips higher than a squat.',
      'Pull the slack out of the bar before you lift, then push the floor away.',
      'Lock out by squeezing your glutes — no hyperextension.',
    ],
    substitutions: ['Romanian Deadlift', 'Trap Bar Deadlift', 'Dumbbell Deadlift'],
  },
  {
    id: 'romanian-deadlift',
    name: 'Romanian Deadlift',
    muscleGroup: 'Legs',
    equipment: 'Full Gym',
    difficulty: 'Intermediate',
    instructions: [
      'Start standing with a soft knee bend and the bar against your thighs.',
      'Push your hips back and let the bar graze your legs on the way down.',
      'Stop when your hamstrings say stop, then drive the hips forward.',
    ],
    substitutions: ['Dumbbell RDL', 'Good Morning', 'Hip Thrust'],
  },
  {
    id: 'hip-thrust',
    name: 'Barbell Hip Thrust',
    muscleGroup: 'Legs',
    equipment: 'Full Gym',
    difficulty: 'Beginner',
    instructions: [
      'Shoulder blades on the bench, bar over your hips with a pad.',
      'Tuck your ribs down and drive through your heels to full extension.',
      'Pause for one second at the top with the glutes locked.',
    ],
    substitutions: ['Glute Bridge', 'Dumbbell Hip Thrust'],
  },
  {
    id: 'bulgarian-split-squat',
    name: 'Bulgarian Split Squat',
    muscleGroup: 'Legs',
    equipment: 'Dumbbells',
    difficulty: 'Intermediate',
    instructions: [
      'Rear foot on a bench, front foot far enough forward to keep the shin near vertical.',
      'Drop straight down until the back knee is just off the floor.',
      'Drive through the front heel. Finish all reps on one side before switching.',
    ],
    substitutions: ['Reverse Lunge', 'Step Up'],
  },
  {
    id: 'walking-lunge',
    name: 'Walking Lunge',
    muscleGroup: 'Legs',
    equipment: 'Dumbbells',
    difficulty: 'Beginner',
    instructions: [
      'Step forward into a long stride, back knee tracking toward the floor.',
      'Keep your torso tall — resist the urge to fold forward.',
      'Push through the front heel to bring the back leg through.',
    ],
    substitutions: ['Reverse Lunge', 'Split Squat'],
  },
  {
    id: 'leg-press',
    name: 'Leg Press',
    muscleGroup: 'Legs',
    equipment: 'Full Gym',
    difficulty: 'Beginner',
    instructions: [
      'Feet shoulder width, mid-platform, whole foot in contact.',
      'Lower until your hips stay flat against the pad — no rounding.',
      'Press without slamming the knees into lockout.',
    ],
    substitutions: ['Goblet Squat', 'Hack Squat'],
  },
  {
    id: 'leg-curl',
    name: 'Seated Leg Curl',
    muscleGroup: 'Legs',
    equipment: 'Full Gym',
    difficulty: 'Beginner',
    instructions: [
      'Set the pad just above your heels and strap the thighs down.',
      'Curl hard, then take three seconds to return.',
    ],
    substitutions: ['Nordic Curl', 'Dumbbell RDL'],
  },
  {
    id: 'calf-raise',
    name: 'Standing Calf Raise',
    muscleGroup: 'Legs',
    equipment: 'Full Gym',
    difficulty: 'Beginner',
    instructions: [
      'Balls of the feet on the platform, heels free to drop below.',
      'Full stretch at the bottom, one-second squeeze at the top.',
    ],
    substitutions: ['Single Leg Calf Raise'],
  },
  {
    id: 'bench-press',
    name: 'Barbell Bench Press',
    muscleGroup: 'Chest',
    equipment: 'Full Gym',
    difficulty: 'Intermediate',
    instructions: [
      'Shoulder blades pulled back and down, feet planted, slight arch.',
      'Lower the bar to the base of your sternum under control.',
      'Press up and slightly back toward your face.',
    ],
    substitutions: ['Dumbbell Bench Press', 'Push-Up', 'Machine Chest Press'],
  },
  {
    id: 'incline-db-press',
    name: 'Incline Dumbbell Press',
    muscleGroup: 'Chest',
    equipment: 'Dumbbells',
    difficulty: 'Beginner',
    instructions: [
      'Set the bench to roughly 30 degrees — higher turns it into a shoulder press.',
      'Lower until you feel a stretch across the chest, then press together.',
    ],
    substitutions: ['Incline Barbell Press', 'Incline Push-Up'],
  },
  {
    id: 'push-up',
    name: 'Push-Up',
    muscleGroup: 'Chest',
    equipment: 'No Equipment',
    difficulty: 'Beginner',
    instructions: [
      'Hands just outside shoulder width, body in one straight line.',
      'Lower your chest to a fist off the floor with the elbows at about 45 degrees.',
      'Push the floor away and hold the plank position throughout.',
    ],
    substitutions: ['Incline Push-Up', 'Knee Push-Up', 'Dumbbell Bench Press'],
  },
  {
    id: 'cable-fly',
    name: 'Cable Fly',
    muscleGroup: 'Chest',
    equipment: 'Full Gym',
    difficulty: 'Beginner',
    instructions: [
      'Soft elbows, fixed angle — this is a hug, not a press.',
      'Bring the handles together and squeeze for a beat.',
    ],
    substitutions: ['Dumbbell Fly', 'Pec Deck'],
  },
  {
    id: 'dips',
    name: 'Parallel Bar Dip',
    muscleGroup: 'Chest',
    equipment: 'Full Gym',
    difficulty: 'Advanced',
    instructions: [
      'Lean slightly forward to bias the chest, stay upright to bias triceps.',
      'Lower until the upper arm is parallel, then press to a strong lockout.',
    ],
    substitutions: ['Assisted Dip', 'Close-Grip Bench Press'],
  },
  {
    id: 'pull-up',
    name: 'Pull-Up',
    muscleGroup: 'Back',
    equipment: 'Full Gym',
    difficulty: 'Advanced',
    instructions: [
      'Start from a dead hang with the shoulders active, not slack.',
      'Pull your chest toward the bar and lead with the elbows.',
      'Lower under control for the full three seconds.',
    ],
    substitutions: ['Lat Pulldown', 'Assisted Pull-Up', 'Inverted Row'],
  },
  {
    id: 'lat-pulldown',
    name: 'Lat Pulldown',
    muscleGroup: 'Back',
    equipment: 'Full Gym',
    difficulty: 'Beginner',
    instructions: [
      'Grip slightly wider than shoulders, chest up, small backward lean.',
      'Pull the bar to your collarbone and drive the elbows down.',
      'Let the lats stretch fully at the top of every rep.',
    ],
    substitutions: ['Pull-Up', 'Single Arm Pulldown'],
  },
  {
    id: 'barbell-row',
    name: 'Barbell Row',
    muscleGroup: 'Back',
    equipment: 'Full Gym',
    difficulty: 'Intermediate',
    instructions: [
      'Hinge to roughly 45 degrees and hold that torso angle for every rep.',
      'Row to the bottom of your ribcage, not your chest.',
      'Control the bar down — no bouncing off the floor.',
    ],
    substitutions: ['Dumbbell Row', 'Chest Supported Row', 'Seated Cable Row'],
  },
  {
    id: 'dumbbell-row',
    name: 'Single Arm Dumbbell Row',
    muscleGroup: 'Back',
    equipment: 'Dumbbells',
    difficulty: 'Beginner',
    instructions: [
      'Brace one hand on a bench, back flat, hips square.',
      'Row the dumbbell to your hip and pause at the top.',
    ],
    substitutions: ['Seated Cable Row', 'Inverted Row'],
  },
  {
    id: 'seated-row',
    name: 'Seated Cable Row',
    muscleGroup: 'Back',
    equipment: 'Full Gym',
    difficulty: 'Beginner',
    instructions: [
      'Sit tall, knees soft, chest against an imaginary wall.',
      'Pull to the navel, squeeze the shoulder blades, then let them travel forward on the return.',
    ],
    substitutions: ['Dumbbell Row', 'Chest Supported Row'],
  },
  {
    id: 'inverted-row',
    name: 'Inverted Row',
    muscleGroup: 'Back',
    equipment: 'Home Equipment',
    difficulty: 'Beginner',
    instructions: [
      'Set a bar at hip height and hang underneath with a straight body line.',
      'Pull your chest to the bar and keep the hips level with the shoulders.',
    ],
    substitutions: ['Lat Pulldown', 'Band Row'],
  },
  {
    id: 'face-pull',
    name: 'Face Pull',
    muscleGroup: 'Shoulders',
    equipment: 'Full Gym',
    difficulty: 'Beginner',
    instructions: [
      'Rope at eye height, pull toward your forehead and rotate the hands back.',
      'Light weight, high reps. This is health work, not an ego lift.',
    ],
    substitutions: ['Band Pull-Apart', 'Rear Delt Fly'],
  },
  {
    id: 'overhead-press',
    name: 'Standing Overhead Press',
    muscleGroup: 'Shoulders',
    equipment: 'Full Gym',
    difficulty: 'Intermediate',
    instructions: [
      'Bar on the front delts, elbows slightly in front, glutes and abs tight.',
      'Move your head back, press up, then bring your head through under the bar.',
    ],
    substitutions: ['Seated Dumbbell Press', 'Machine Shoulder Press'],
  },
  {
    id: 'db-shoulder-press',
    name: 'Seated Dumbbell Shoulder Press',
    muscleGroup: 'Shoulders',
    equipment: 'Dumbbells',
    difficulty: 'Beginner',
    instructions: [
      'Start at ear height with the wrists stacked over the elbows.',
      'Press until the dumbbells almost touch, then lower with control.',
    ],
    substitutions: ['Standing Overhead Press', 'Arnold Press'],
  },
  {
    id: 'lateral-raise',
    name: 'Dumbbell Lateral Raise',
    muscleGroup: 'Shoulders',
    equipment: 'Dumbbells',
    difficulty: 'Beginner',
    instructions: [
      'Lead with the elbows and stop at shoulder height.',
      'Lower slowly — most of the work is on the way down.',
    ],
    substitutions: ['Cable Lateral Raise', 'Machine Lateral Raise'],
  },
  {
    id: 'rear-delt-fly',
    name: 'Rear Delt Fly',
    muscleGroup: 'Shoulders',
    equipment: 'Dumbbells',
    difficulty: 'Beginner',
    instructions: [
      'Hinge forward, arms hanging, thumbs slightly down.',
      'Sweep the arms wide, not back.',
    ],
    substitutions: ['Face Pull', 'Reverse Pec Deck'],
  },
  {
    id: 'bicep-curl',
    name: 'Dumbbell Bicep Curl',
    muscleGroup: 'Arms',
    equipment: 'Dumbbells',
    difficulty: 'Beginner',
    instructions: [
      'Elbows pinned to your sides, curl without swinging the torso.',
      'Full extension at the bottom of every rep.',
    ],
    substitutions: ['Barbell Curl', 'Cable Curl', 'Band Curl'],
  },
  {
    id: 'hammer-curl',
    name: 'Hammer Curl',
    muscleGroup: 'Arms',
    equipment: 'Dumbbells',
    difficulty: 'Beginner',
    instructions: [
      'Neutral grip throughout, thumbs pointing at the ceiling.',
      'Control the lowering phase for two seconds.',
    ],
    substitutions: ['Rope Curl', 'Dumbbell Bicep Curl'],
  },
  {
    id: 'tricep-pushdown',
    name: 'Tricep Pushdown',
    muscleGroup: 'Arms',
    equipment: 'Full Gym',
    difficulty: 'Beginner',
    instructions: [
      'Elbows locked at your sides, push down to a full lockout.',
      'Let the rope travel apart at the bottom.',
    ],
    substitutions: ['Overhead Tricep Extension', 'Close-Grip Push-Up'],
  },
  {
    id: 'overhead-tricep',
    name: 'Overhead Tricep Extension',
    muscleGroup: 'Arms',
    equipment: 'Dumbbells',
    difficulty: 'Beginner',
    instructions: [
      'Keep the elbows narrow and pointing forward.',
      'Get a real stretch at the bottom — that is where the growth is.',
    ],
    substitutions: ['Tricep Pushdown', 'Skull Crusher'],
  },
  {
    id: 'close-grip-bench',
    name: 'Close-Grip Bench Press',
    muscleGroup: 'Arms',
    equipment: 'Full Gym',
    difficulty: 'Intermediate',
    instructions: [
      'Hands shoulder width, elbows tucked to roughly 30 degrees.',
      'Touch just below the sternum and drive straight up.',
    ],
    substitutions: ['Dips', 'Tricep Pushdown'],
  },
  {
    id: 'plank',
    name: 'Front Plank',
    muscleGroup: 'Core',
    equipment: 'No Equipment',
    difficulty: 'Beginner',
    instructions: [
      'Elbows under shoulders, ribs down, glutes squeezed.',
      'Hold a straight line. Stop the set when the hips start to sag.',
    ],
    substitutions: ['Dead Bug', 'Ab Wheel Rollout'],
  },
  {
    id: 'dead-bug',
    name: 'Dead Bug',
    muscleGroup: 'Core',
    equipment: 'No Equipment',
    difficulty: 'Beginner',
    instructions: [
      'Press your lower back into the floor and keep it there.',
      'Extend the opposite arm and leg slowly, then return.',
    ],
    substitutions: ['Front Plank', 'Bird Dog'],
  },
  {
    id: 'hanging-leg-raise',
    name: 'Hanging Leg Raise',
    muscleGroup: 'Core',
    equipment: 'Full Gym',
    difficulty: 'Advanced',
    instructions: [
      'Hang tall, then curl the pelvis up rather than just swinging the legs.',
      'Lower under control — no momentum.',
    ],
    substitutions: ['Lying Leg Raise', 'Knee Raise'],
  },
  {
    id: 'cable-crunch',
    name: 'Cable Crunch',
    muscleGroup: 'Core',
    equipment: 'Full Gym',
    difficulty: 'Beginner',
    instructions: [
      'Hips stay fixed. Crunch the ribs toward the pelvis.',
      'Think about shortening the distance, not pulling the weight.',
    ],
    substitutions: ['Ab Wheel Rollout', 'Weighted Sit-Up'],
  },
  {
    id: 'russian-twist',
    name: 'Russian Twist',
    muscleGroup: 'Core',
    equipment: 'No Equipment',
    difficulty: 'Beginner',
    instructions: [
      'Sit back to about 45 degrees with a tall spine.',
      'Rotate from the ribcage, not the arms.',
    ],
    substitutions: ['Pallof Press', 'Side Plank'],
  },
  {
    id: 'kettlebell-swing',
    name: 'Kettlebell Swing',
    muscleGroup: 'Full Body',
    equipment: 'Home Equipment',
    difficulty: 'Intermediate',
    instructions: [
      'Hike the bell back between your legs like a rugby pass.',
      'Snap the hips forward — the arms are ropes, not levers.',
      'The bell floats to chest height. Do not lift it with your shoulders.',
    ],
    substitutions: ['Dumbbell Swing', 'Hip Thrust'],
  },
  {
    id: 'burpee',
    name: 'Burpee',
    muscleGroup: 'HIIT',
    equipment: 'No Equipment',
    difficulty: 'Intermediate',
    instructions: [
      'Chest to the floor, then drive the feet back under you.',
      'Stand and jump. Keep the rhythm steady rather than sprinting the first ten.',
    ],
    substitutions: ['Squat Thrust', 'Mountain Climber'],
  },
  {
    id: 'mountain-climber',
    name: 'Mountain Climber',
    muscleGroup: 'HIIT',
    equipment: 'No Equipment',
    difficulty: 'Beginner',
    instructions: [
      'Strong plank, hips low, drive the knees toward the chest.',
      'Quick feet, quiet hands.',
    ],
    substitutions: ['High Knees', 'Burpee'],
  },
  {
    id: 'jump-squat',
    name: 'Jump Squat',
    muscleGroup: 'HIIT',
    equipment: 'No Equipment',
    difficulty: 'Intermediate',
    instructions: [
      'Sit into a quarter squat and jump as high as you can.',
      'Land soft, absorb through the hips, then reset.',
    ],
    substitutions: ['Bodyweight Squat', 'Box Jump'],
  },
  {
    id: 'box-jump',
    name: 'Box Jump',
    muscleGroup: 'Full Body',
    equipment: 'Full Gym',
    difficulty: 'Intermediate',
    instructions: [
      'Load the hips, swing the arms, land quietly in a quarter squat.',
      'Step down every rep. Never rebound off a box.',
    ],
    substitutions: ['Jump Squat', 'Broad Jump'],
  },
  {
    id: 'sled-push',
    name: 'Sled Push',
    muscleGroup: 'Full Body',
    equipment: 'Full Gym',
    difficulty: 'Intermediate',
    instructions: [
      'Low body angle, arms locked, drive with short powerful steps.',
      'Keep the sled moving — do not let it stall.',
    ],
    substitutions: ['Farmers Carry', 'Bike Sprint'],
  },
  {
    id: 'farmers-carry',
    name: "Farmer's Carry",
    muscleGroup: 'Full Body',
    equipment: 'Dumbbells',
    difficulty: 'Beginner',
    instructions: [
      'Stand tall, shoulders down, ribs stacked over the hips.',
      'Walk with normal steps and do not let the weights swing.',
    ],
    substitutions: ['Suitcase Carry', 'Sled Push'],
  },
  {
    id: 'rower-intervals',
    name: 'Rowing Intervals',
    muscleGroup: 'HIIT',
    equipment: 'Full Gym',
    difficulty: 'Intermediate',
    instructions: [
      'Legs, then hips, then arms. Reverse that order on the recovery.',
      'Hold a consistent split — the goal is repeatable effort, not one fast piece.',
    ],
    substitutions: ['Assault Bike', 'Ski Erg'],
  },
  {
    id: 'assault-bike',
    name: 'Assault Bike Intervals',
    muscleGroup: 'HIIT',
    equipment: 'Full Gym',
    difficulty: 'Intermediate',
    instructions: [
      'Push and pull with the arms as hard as you drive with the legs.',
      'Aim for the same output on the last interval as the first.',
    ],
    substitutions: ['Rowing Intervals', 'Skipping'],
  },
  {
    id: 'skipping',
    name: 'Skipping',
    muscleGroup: 'HIIT',
    equipment: 'Home Equipment',
    difficulty: 'Beginner',
    instructions: [
      'Small bounces on the balls of the feet, wrists doing the turning.',
      'Stay relaxed through the shoulders.',
    ],
    substitutions: ['High Knees', 'Mountain Climber'],
  },
  {
    id: 'bodyweight-squat',
    name: 'Bodyweight Squat',
    muscleGroup: 'Legs',
    equipment: 'No Equipment',
    difficulty: 'Beginner',
    instructions: [
      'Feet shoulder width, toes slightly out.',
      'Sit down and back, keeping the heels planted.',
      'Stand and squeeze the glutes at the top.',
    ],
    substitutions: ['Goblet Squat', 'Box Squat'],
  },
  {
    id: 'glute-bridge',
    name: 'Glute Bridge',
    muscleGroup: 'Legs',
    equipment: 'No Equipment',
    difficulty: 'Beginner',
    instructions: [
      'Heels close to your hips, ribs down.',
      'Drive the hips up and hold for two seconds.',
    ],
    substitutions: ['Hip Thrust', 'Single Leg Bridge'],
  },
  {
    id: 'pike-push-up',
    name: 'Pike Push-Up',
    muscleGroup: 'Shoulders',
    equipment: 'No Equipment',
    difficulty: 'Intermediate',
    instructions: [
      'Hips high, head between the hands, body in an inverted V.',
      'Lower the crown of your head toward the floor and press back up.',
    ],
    substitutions: ['Seated Dumbbell Shoulder Press', 'Push-Up'],
  },
  {
    id: 'band-pull-apart',
    name: 'Band Pull-Apart',
    muscleGroup: 'Shoulders',
    equipment: 'Home Equipment',
    difficulty: 'Beginner',
    instructions: [
      'Arms straight at chest height, pull the band to your sternum.',
      'Squeeze for a beat and return slowly.',
    ],
    substitutions: ['Face Pull', 'Rear Delt Fly'],
  },
  {
    id: 'world-greatest-stretch',
    name: "World's Greatest Stretch",
    muscleGroup: 'Full Body',
    equipment: 'No Equipment',
    difficulty: 'Beginner',
    instructions: [
      'Deep lunge, opposite hand down, rotate the top arm to the ceiling.',
      'Breathe out at the end range. Three each side.',
    ],
  },
  {
    id: 'cat-cow',
    name: 'Cat-Cow',
    muscleGroup: 'Core',
    equipment: 'No Equipment',
    difficulty: 'Beginner',
    instructions: [
      'Move slowly between full flexion and full extension of the spine.',
      'Match the pace to your breathing.',
    ],
  },
  {
    id: 'hip-flexor-stretch',
    name: 'Couch Stretch',
    muscleGroup: 'Legs',
    equipment: 'No Equipment',
    difficulty: 'Beginner',
    instructions: [
      'Rear shin against a wall or bench, front foot planted.',
      'Squeeze the rear glute and stay tall. Ninety seconds each side.',
    ],
  },
]

export const EXERCISES: Exercise[] = SEEDS.map(build)

export const EXERCISE_BY_ID: Record<string, Exercise> = Object.fromEntries(
  EXERCISES.map((exercise) => [exercise.id, exercise]),
)

export function getExercise(id: string): Exercise {
  const exercise = EXERCISE_BY_ID[id]
  if (!exercise) throw new Error(`Unknown exercise: ${id}`)
  return exercise
}
