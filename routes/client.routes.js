const {Router}=require("express");
const { addClient, getAllClients, getClientByPhone, getClientsById, updateClient,deleteClient, loginClient, logoutClient, refreshToken, clientActivate } = require("../controllers/clients.controllers");
const router=Router();
const clientPolice=require("../middleware/client_police");

router.post("/add",addClient)
router.post("/login",loginClient)
router.post("/logout", logoutClient);
router.post("/refresh", refreshToken);
router.get("/activate/:link", clientActivate);
router.get("/",clientPolice,getAllClients)
router.get("/phone",getClientByPhone)
router.get("/:id",clientPolice, getClientsById);
router.put("/:id",updateClient)
router.delete("/:id",deleteClient)

module.exports=router