const itemService = require('../services/itemService');
const activityService = require('../services/activityService');

class ItemController {
    async getAll(req, res) {
        try {
            const items = await itemService.findAll();
            res.json(items);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getById(req, res) {
        try {
            const item = await itemService.findById(req.params.id);
            if (!item) return res.status(404).json({ message: 'Item not found' });
            res.json(item);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async create(req, res) {
        try {
            const userId = req.user.id; // comes from auth middleware
            const item = await itemService.create(req.body, userId);
            res.status(201).json(item);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const userId = req.user.id;
            const item = await itemService.update(req.params.id, req.body, userId);
            res.json(item);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const userId = req.user.id;
            await itemService.delete(req.params.id, userId);
            res.status(204).send();
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

class ActivityController {
    async getAll(req, res) {
        try {
            const activities = await activityService.findAll();
            res.json(activities);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = {
    itemController: new ItemController(),
    activityController: new ActivityController()
};
