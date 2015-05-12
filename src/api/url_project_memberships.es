module.exports = (prj) => {
  // strip project
  if(prj.project)
    prj = prj.project;
  
  return `projects/${prj.identifier}/memberships`;
};
