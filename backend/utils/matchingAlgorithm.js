// Basic matching algorithm to find suggested teammates for projects

const calculateSkillOverlap = (studentSkills, requiredSkills) => {
  if (!requiredSkills || requiredSkills.length === 0) return 0;
  if (!studentSkills || studentSkills.length === 0) return 0;

  const matchingSkills = studentSkills.filter(skill => 
    requiredSkills.some(required => 
      required.toLowerCase().includes(skill.toLowerCase()) ||
      skill.toLowerCase().includes(required.toLowerCase())
    )
  );

  return matchingSkills.length;
};

const calculateMatchScore = (studentSkills, requiredSkills, studentInterests, projectTitle, projectDescription) => {
  // Primary scoring based on skill overlap
  const skillMatches = calculateSkillOverlap(studentSkills, requiredSkills);
  const skillScore = (skillMatches / Math.max(requiredSkills.length, 1)) * 100;

  // Secondary scoring based on interest alignment
  let interestScore = 0;
  if (studentInterests && studentInterests.length > 0) {
    const projectText = `${projectTitle} ${projectDescription}`.toLowerCase();
    const matchingInterests = studentInterests.filter(interest =>
      projectText.includes(interest.toLowerCase())
    );
    interestScore = (matchingInterests.length / studentInterests.length) * 30;
  }

  // Combined score (70% skills, 30% interests)
  return Math.round((skillScore * 0.7) + (interestScore * 0.3));
};

const findSuggestedTeammates = async (project, allProfiles) => {
  // Exclude project owner and existing members
  const excludedIds = [
    project.owner.toString(),
    ...project.members.map(member => member.profile.toString())
  ];

  const eligibleStudents = allProfiles.filter(profile => 
    !excludedIds.includes(profile._id.toString())
  );

  // Calculate match scores for each eligible student
  const matches = eligibleStudents.map(student => {
    const matchScore = calculateMatchScore(
      student.skills || [],
      project.requiredSkills || [],
      student.projectInterests || [],
      project.title || '',
      project.description || ''
    );

    return {
      student: {
        _id: student._id,
        name: student.name,
        department: student.department,
        academicYear: student.academicYear,
        skills: student.skills,
        projectInterests: student.projectInterests
      },
      matchScore,
      matchingSkills: calculateMatchingSkills(student.skills || [], project.requiredSkills || []),
      skillOverlapCount: calculateSkillOverlap(student.skills || [], project.requiredSkills || [])
    };
  });

  // Filter students with at least some skill overlap and sort by match score
  const suggestedTeammates = matches
    .filter(match => match.skillOverlapCount > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 10); // Return top 10 matches

  return suggestedTeammates;
};

const calculateMatchingSkills = (studentSkills, requiredSkills) => {
  if (!requiredSkills || requiredSkills.length === 0) return [];
  if (!studentSkills || studentSkills.length === 0) return [];

  return studentSkills.filter(skill => 
    requiredSkills.some(required => 
      required.toLowerCase().includes(skill.toLowerCase()) ||
      skill.toLowerCase().includes(required.toLowerCase())
    )
  );
};

// Find projects that match a student's skills
const findMatchingProjects = async (student, allProjects) => {
  // Exclude projects where student is owner or member
  const excludedProjectIds = [
    ...(student.projectsCreated || []).map(id => id.toString()),
    ...(student.projectsJoined || []).map(id => id.toString())
  ];

  const eligibleProjects = allProjects.filter(project => 
    !excludedProjectIds.includes(project._id.toString()) &&
    project.status === 'Looking for members' &&
    project.members.length < project.teamSize
  );

  const matches = eligibleProjects.map(project => {
    const matchScore = calculateMatchScore(
      student.skills || [],
      project.requiredSkills || [],
      student.projectInterests || [],
      project.title || '',
      project.description || ''
    );

    return {
      project: {
        _id: project._id,
        title: project.title,
        description: project.description,
        requiredSkills: project.requiredSkills,
        teamSize: project.teamSize,
        currentMembers: project.members.length,
        owner: project.owner,
        status: project.status
      },
      matchScore,
      matchingSkills: calculateMatchingSkills(student.skills || [], project.requiredSkills || []),
      skillOverlapCount: calculateSkillOverlap(student.skills || [], project.requiredSkills || [])
    };
  });

  return matches
    .filter(match => match.skillOverlapCount > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 10);
};

module.exports = {
  findSuggestedTeammates,
  findMatchingProjects,
  calculateSkillOverlap,
  calculateMatchScore
};