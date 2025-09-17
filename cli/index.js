#!/usr/bin/env node

import { createPage } from './commands/newPage.js';
import { deletePage } from './commands/deletePage.js';
import { editPage } from './commands/editPage.js';

const args = process.argv.slice(2);
const command = args[0];

switch (command) {
    case 'new-page':
        createPage();
        break;
    case 'delete-page':
        deletePage();
        break;
    case 'edit-page':
        editPage();
        break;
    default:
        console.log('Unknown command. Use new-page, delete-page, or edit-page.');
}
