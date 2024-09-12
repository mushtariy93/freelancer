const {Router}=require("express");
const clientRouter=require("./client.routes")
const adminRouter=require("./admin.routes")
const freelancerRouter=require("./freelancer.routes")
const contractRouter=require("./contract.routes")
const projectRouter=require("./project.routes")
const paymentsRouter=require("./payments.routes")
const skillRouter=require("./skill.routes")
const freelancerSkillRoutes = require("./freel_skills.routes");


const router=Router();

router.use("/client", clientRouter);
router.use("/admin",adminRouter);
router.use("/free",freelancerRouter);
router.use("/contract", contractRouter);
router.use("/project", projectRouter);
router.use("/payments", paymentsRouter);
router.use("/skill",skillRouter);
router.use("/freeskill", freelancerSkillRoutes);




module.exports=router;