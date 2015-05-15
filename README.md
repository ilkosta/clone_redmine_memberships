Use with something like

```javascript
var cloneMemberships  = require('clone_redmine_memberships');

var clonePrj = (redmine, srcPrj, newName) => {
  assert(typeof srcPrj === 'object');
  assert(typeof newName === 'string');
  
  let prog = mkNewProjectData(srcPrj, newName);
  
  return redmine .post('projects', { project: prog })
          .success((res) => { cloneMemberships(redmine, srcPrj, prog); })
          .success(results => { if(results) results.forEach(m => { winston.log('debug',m); }); });
          
};
```
