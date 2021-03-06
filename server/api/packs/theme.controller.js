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

exports.update = function(req, res) {
  res.json(req.body);
};


// Get list of things
exports.index = function(req, res) {
  res.json([
      {
         "themeID":"a9615632-8901-4a2e-8648-b1859606c804",
         "name":"Red",
         "author":"Xrm.Tools Team",
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
         "PreviewImages":[
            {
               "Title":"Image #1",
               "ImageUrl":"http://placekitten.com/602/300"
            },
            {
               "Title":"Image #2",
               "ImageUrl":"http://placekitten.com/603/300"
            },
            {
               "Title":"Image #3",
               "ImageUrl":"http://placekitten.com/604/300"
            }
         ]
      },
      {
         "themeID":"7db88ea9-7793-4aa5-b74d-941eb6bf24a4",
         "name":"Ghost ",
         "author":"Xrm.Tools Team",
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
         "controlshade":"#F3F1F1",
         "PreviewImages":[
            {
               "Title":"Image #1",
               "ImageUrl":"http://placekitten.com/602/300"
            },
            {
               "Title":"Image #2",
               "ImageUrl":"http://placekitten.com/603/300"
            },
            {
               "Title":"Image #3",
               "ImageUrl":"http://placekitten.com/604/300"
            }
         ]
      },
      {
         "themeID":"7db88ea9-7793-4aa5-b74d-941eb6bf24a4",
         "name":"Black",
         "author":null,
         "headercolor":"#000000",
         "selectedlinkeffect":"#B1D6F0",
         "defaultcustomentitycolor":"#006551",
         "globallinkcolor":"#1160B7",
         "processcontrolcolor":"#0755BE",
         "controlborder":"#CCCCCC",
         "navbarbackgroundcolor":"#000000",
         "hoverlinkeffect":"#D7EBF9",
         "logotooltip":"Microsoft Dynamics CRM",
         "defaultentitycolor":"#001CA5",
         "navbarshelfcolor":"#DFE2E8",
         "controlshade":"#F3F1F1",
         "PreviewImages":null
      }
   ]);
};
