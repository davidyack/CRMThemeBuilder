/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /themes              ->  index
 * POST    /themes              ->  create
 * GET     /themes/:id          ->  show
 * PUT     /themes/:id          ->  update
 * DELETE  /themes/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var dummy = function(req, res) {
  res.json(req.body);
};



exports.create = dummy;
exports.update = dummy;
exports.delete = dummy;

// Get list of things
exports.index = function(req, res) {
  res.json([
      {
         "themeID":"e9615632-8901-4a2e-8648-b1859606c804",
         "name":"CRM Theme #1",
         "author":null,
         "headercolor":"#CC0000",
         "selectedlinkeffect":"#B1D6F0",
         "defaultcustomentitycolor":"#006551",
         "globallinkcolor":"#1160B7",
         "processcontrolcolor":"#0755BE",
         "controlborder":"#CCCCCC",
         "navbarbackgroundcolor":"#CC0000",
         "hoverlinkeffect":"#D7EBF9",
         "logotooltip":"Microsoft Dynamics CRM",
         "defaultentitycolor":"#001CA5",
         "navbarshelfcolor":"#DFE2E8",
         "controlshade":"#F3F1F1",
         "readonly": true,
         "currenttheme": true
      },
      {
         "themeID":"ddb88ea9-7793-4aa5-b74d-941eb6bf24a4",
         "name":"CRM Theme #2 ",
         "author":null,
         "headercolor":"#ffffff",
         "selectedlinkeffect":"#B1D6F0",
         "defaultcustomentitycolor":"#006551",
         "globallinkcolor":"#1160B7",
         "processcontrolcolor":"#0755BE",
         "controlborder":"#CCCCCC",
         "navbarbackgroundcolor":"#ffffff",
         "hoverlinkeffect":"#D7EBF9",
         "logotooltip":"Microsoft Dynamics CRM",
         "defaultentitycolor":"#001CA5",
         "navbarshelfcolor":"#DFE2E8",
         "controlshade":"#F3F1F1"
      }
   ]);
};
