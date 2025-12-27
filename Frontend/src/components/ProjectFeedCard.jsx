import React, { useState } from 'react';
import { sendJoinRequest } from '../api/api';
import './ProjectFeedCard.css';

const ProjectFeedCard = ({ project, onJoinRequest, currentUserId }) => {
  const [isJoining, setIsJoining] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinMessage, setJoinMessage] = useState('');

  const handleJoinRequest = async () => {
    if (!currentUserId) {
      alert('Please create a profile first to join projects');
      return;
    }

    if (project.owner._id === currentUserId) {
      alert('You cannot join your own project');
      return;
    }

    setIsJoining(true);
    try {
      await sendJoinRequest({
        projectId: project._id,
        studentId: currentUserId,
        message: joinMessage
      });
      
      setShowJoinModal(false);
      setJoinMessage('');
      if (onJoinRequest) {
        onJoinRequest(project._id);
      }
    } catch (error) {
      alert(error.message || 'Failed to send join request');
    } finally {
      setIsJoining(false);
    }
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const projectDate = new Date(date);
    const diffTime = Math.abs(now - projectDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Looking for members': return '#10b981';
      case 'In Progress': return '#3b82f6';
      case 'Completed': return '#6b7280';
      default: return '#f59e0b';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Looking for members': return '🟢';
      case 'In Progress': return '🔵';
      case 'Completed': return '✅';
      default: return '🟡';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Research': return '🔬';
      case 'Web Development': return '💻';
      case 'Mobile App': return '📱';
      case 'Data Science': return '📊';
      case 'AI/ML': return '🤖';
      default: return '📋';
    }
  };

  const currentMembers = project.members ? project.members.length : 0;
  const isTeamFull = currentMembers >= project.teamSize;
  const canJoin = project.status === 'Looking for members' && !isTeamFull && currentUserId && project.owner._id !== currentUserId;

  return (
    <>
      <div className="project-feed-card">
        {/* Header Section */}
        <div className="feed-card-header">
          <div className="project-owner-info">
            <div className="owner-avatar">
              {project.owner?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="owner-details">
              <div className="owner-name">{project.owner?.name || 'Unknown User'}</div>
              <div className="owner-meta">
                {project.owner?.department && (
                  <span className="department">{project.owner.department}</span>
                )}
                {project.owner?.academicYear && (
                  <>
                    <span className="separator">•</span>
                    <span className="academic-year">{project.owner.academicYear}</span>
                  </>
                )}
           d;arProjectFeedCt default or
exp
};
 </>
  );   )}
   >
     </divv>
        </di            </div>
       ton>
  </but      t'}
       eseqund R...' : 'Seding Requestg ? 'SensJoinin   {i              >
            Joining}
 disabled={is              
  Request}Joinleand{hick=nCl   o    
         ary-btn"sName="prim clas             <button 
             ton>
      </but           el
  Canc             >
          }
     lse)inModal(fa> setShowJolick={() =  onC             "
 y-btncondarme="selassNa      c    
         <button    ">
        terodal-foo"mssName=iv cla <d          
   </div>        </div>
      
                   />
        rows="4"          
       t..."ojecthis preat fit for ou'd be a gr yain whyplnd exe yourself ar="Introducaceholde    pl              }
get.value)ge(e.tarJoinMessa=> sethange={(e)  onC               ge}
  {joinMessa     value=        "
     join-messageid="                  extarea
   <t       el>
      ional)</labowner (optproject Message to n-message">="joi htmlFor<label           
     ction">ssage-sessName="mela  <div c         </div>
          p>
       r?.name}</ect.ownep>by {proj      <
          h4>le}</itoject.t4>{pr <h               ary">
ect-summe="projNamssv cla         <didy">
     e="modal-boamssN   <div cla      /div>
     <
          </button>               ×
        >
                     e)}
dal(falsJoinMo=> setShow)  onClick={(        
       ose-btn"e="cl    classNam         ton 
   <but        >
      ject</h3Prooin equest to J>R    <h3        er">
  -headame="modalv classN     <di
       agation()}>> e.stopProp(e) =" onClick={-modalsName="joiniv clas<d         >
 lse)}al(fainModetShowJo s=>lick={() " onCerlaymodal-ovassName="     <div cl   && (
dal owJoinMo
      {sh/}t Modal *quesn Re     {/* Joi/div>

       <   </div>
   div>
           </  </div>
                )}
      tton>
      </bu          ails
       View Det          
           >  n"
       btw-ry-btn viendacossName="se   cla           
    n    <butto          ) : (
              tton>
     </bu           }
   oin'equest to J...' : 'R? 'SendingisJoining  {               >
                oining}
  abled={isJ         dis      )}
   dal(truewJoinMoho => setS()ck={nCli         o         in-btn"
y-btn joar"primclassName=                 
     <button        
     anJoin ? (          {c   s">
 -action"primaryassName=cl     <div 

       iv>     </d>
          </button           pan>
t">Share</saction-texsName="pan clas    <s            >📤</span>
"ction-icon="an className  <spa     
                 >     roject"
  pare"Sh  title=       n"
       share-btion-btn ="actssName    cla      
          <button        
                 utton>
 </b             }</span>
e'aved' : 'Savved ? 'S">{isSaextction-tName="aspan class    <     an>
       📌'}</sp🔖' : ' 'd ?avecon">{isSction-issName="a <span cla            >
             
    project'}'Save aved' : ove from sed ? 'RemsSav title={i            
   aved)}ed(!isSIsSav() => set={  onClick              }`}
 : '''saved'ed ? ${isSav save-btn on-btnsName={`acti   clas          
    on   <butt  >
         actions"ndary-Name="secosslav c       <di">
     tionsrd-acassName="ca  <div cl   iv>

      </d          )}
       /span>
    ll<">Team Fuull-badgem-fame="tean classN <spa              && (
amFull       {isTeiv>
           </d   </span>
          d
       embers joineeamSize} mproject.t}/{berscurrentMem  {        ">
      team-countassName="cl      <span    div>
      </            
 ></div>              }}
  0}%` ze) * 10mSiject.teabers / pro(currentMem`${ width: ={{      style      
       "s-fillesme="progr classNa            div 
               <      -bar">
ss="progressName   <div cla     
      rogress">me="team-pdiv classNa          <us">
  "team-statame=ssN   <div cla      ">
 ooterrd-feed-cassName="fladiv c    <    ion */}
oter Sect{/* Fo        div>


        </     )}   </div>
            </div>
                    )}
           span>
           </        more
 6}ength - edSkills.lject.requir      +{pro          lls">
    l more-ski="skill-pilassNamespan cl      <        (
     ngth > 6 &&ledSkills.uireject.req        {pro    ))}
                
    /span>           <l}
            {skil               ">
-pill="skillamedex} classN key={in    <span              (
index) => skill, ap(((0, 6).mills.slicedSkequireroject.r     {p           s-pills">
me="skillssNa <div cla             ">
ls-containerame="skilssN cla<div            
 ( 0 &&ngth >.leiredSkillst.requ && projecSkillsiredt.requ{projec           
       </p>
    }
        scriptionroject.de   : p        )}...` 
   , 200ubstring(0tion.sdescrip `${project.    ?        > 200 
  ?.length ionptt.descriojec{pr         
   tion">escripject-dssName="pro <p cla     
    </h3>ect.title}projitle">{"project-tssName= <h3 cla     
    ">ody-card-be="feedv classNam <di    }
   on */cti {/* Body Se

         </div>     iv>
     </ddiv>
            </
      >pans}</st.statu{projectext">atus-"stclassName=span        <    n>
   )}</spaoject.statusprtatusIcon(getSus-icon">{Name="stat <span class          }>
   t.status) }ecolor(projusClor: getStatle={{ codge" stytus-bataassName="sv cl      <di
      )}           </div>
     
          /span>ory}<roject.categ{pxt">ory-te"categame=span classN      <        span>
  ategory)}</(project.cconegoryIn">{getCatcategory-icosName="asan clsp <            
   dge">gory-bateme="cassNadiv cla          <
     (ory &&ect.categroj      {p">
      ect-badges"proje= classNamiv        <d</div>
  
             </div>      v>
    </di    
         </span> Date())}|| newcreatedAt ect.o(proj{getTimeAgtimestamp">ssName="<span cla                an>
</sp">•torparassName="sean cla<sp     