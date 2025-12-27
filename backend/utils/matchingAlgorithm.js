// Enhanced matching algorithm for dynamic profile suggestions

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

const calculateDomainMatch = (studentInterests, projectTitle, projectDescription, projectCategory) => {
  if (!studentInterests || studentInterests.length === 0) return 0;
  
  const projectText = `${projectTitle} ${projectDescription} ${projectCategory || ''}`.toLowerCase();
  const matchingInterests = studentInterests.filter(interest =>
    projectText.includes(interest.toLowerCase()) ||
    interest.toLowerCase().split(' ').some(word => projectText.includes(word))
  );
  
  return matchingInterests.length;
};

const calculateAcademicAlignment = (studentDepartment, studentYear, projectRequirements) => {
  let score = 0;
  
  // Department relevance
  if (projectRequirements?.preferredDepartments?.includes(studentDepartment)) {
    score += 20;
  }
  
  // Academic year suitability
  const yearMapping = {
    '1st Year': 1, '2nd Year': 2, '3rd Year': 3, '4th Year': 4, 
    'Graduate': 5, 'PhD': 6
  };
  
  const studentLevel = yearMapping[studentYear] || 3;
  const minLevel = yearMapping[projectRequirements?.minAcademicYear] || 1;
  
  if (studentLevel >= minLevel) {
    score += 10;
  }
  
  return score;
};

const calculateExperienceMatch = (studentProfile, projectData) => {
  if (!studentProfile || !projectData) return 0;
  
  const projectsCompleted = studentProfile.projectsJoined?.length || 0;
  const experienceLevel = projectData.experienceLevel || 'Beginner';
  
  const experienceMapping = {
    'Beginner': { min: 0, max: 2 },
    'Intermediate': { min: 1, max: 4 },
    'Advanced': { min: 3, max: 10 }
  };
  
  const range = experienceMapping[experienceLevel] || experienceMapping['Beginner'];
  
  if (projectsCompleted >= range.min && projectsCompleted <= range.max) {
    return 20;
  } else if (projectsCompleted > range.max) {
    return 15; // Overqualified
  }
  
  return 5; // Minimal score for underqualified
};

const calculateMatchScore = (studentSkills, requiredSkills, studentInterests, projectTitle, projectDescription, studentProfile, projectData) => {
  // Skill matching
  const skillMatches = calculateSkillOverlap(studentSkills, requiredSkills);
  const skillScore = skillMatches > 0 ? (skillMatches / Math.max(requiredSkills.length, 1)) * 40 : 0;

  // Interest matching
  const interestMatches = calculateDomainMatch(studentInterests, projectTitle, projectDescription, projectData?.category);
  const interestScore = interestMatches > 0 ? (interestMatches / Math.max(studentInterests.length, 1)) * 30 : 0;

  // Academic alignment scoring
  const academicScore = calculateAcademicAlignment(
    studentProfile?.department, 
    studentProfile?.academicYear, 
    projectData?.requirements
  );

  // Experience factor
  const experienceScore = calculateExperienceMatch(studentProfile, projectData);

  // Combined score with weighted factors
  const totalScore = Math.round(
    (skillScore * 0.5) + 
    (interestScore * 0.25) + 
    (academicScore * 0.15) + 
    (experienceScore * 0.1)
  );

  return Math.min(totalScore, 100); // Cap at 100%
};

const generateSuggestionReason = (student, project, matchedSkills, matchedInterests) => {
  const reasons = [];
  
  if (matchedSkills.length > 0) {
    reasons.push(`Strong match in ${matchedSkills.slice(0, 3).join(', ')}`);
  }
  
  if (matchedInterests.length > 0) {
    reasons.push(`Shared interests in ${matchedInterests.slice(0, 2).join(', ')}`);
  }
  
  if (student.department && project.category) {
    reasons.push(`${student.department} background aligns with ${project.category}`);
  }
  
  const experienceLevel = student.projectsJoined?.length || 0;
  if (experienceLevel > 3) {
    reasons.push(`Experienced collaborator with ${experienceLevel} projects`);
  }
  
  return reasons.length > 0 
    ? reasons.join('; ') 
    : 'Good potential match based on profile analysis';
};

const calculateMatchingSkills = (studentSkills, requiredSkills) => {
  return studentSkills.filter(skill => 
    requiredSkills.some(required => 
      required.toLowerCase().includes(skill.toLowerCase()) ||
      skill.toLowerCase().includes(required.toLowerCase())
    )
  );
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
    const matchedSkills = calculateMatchingSkills(student.skills || [], project.requiredSkills || []);
    const matchedInterests = calculateDomainMatch(student.projectInterests || [], project.title, project.description, project.category);
    
    const matchScore = calculateMatchScore(
      student.skills || [],
      project.requiredSkills || [],
      student.projectInterests || [],
      project.title || '',
      project.description || '',
      student,
      project
    );

    const suggestionReason = generateSuggestionReason(student, project, matchedSkills, matchedInterests);

    return {
      student: {
        _id: student._id,
        name: student.name,
        department: student.department,
        academicYear: student.academicYear,
        skills: student.skills,
        projectInterests: student.projectInterests,
        bio: student.bio,
        projectsCompleted: student.projectsJoined?.length || 0
      },
      matchScore,
      matchingSkills: matchedSkills,
      matchingInterests: matchedInterests,
      suggestionReason,
      skillOverlapCount: matchedSkills.length
    };
  });

  // Filter students with at least some skill overlap and sort by match score
  return matches
    .filter(match => match.skillOverlapCount > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 10);
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
      project.description || '',
      student,
      project
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