(function () {
  const STORAGE_KEY = 'quezonxplore.object.database.v2';
  const EXHIBITS_KEY = 'quezonxplore.exhibits.v2';

  const defaultDatabase = {
    supportedObjects: [
      {
        id: 'ancient-vase',
        name: 'Ancient Vase',
        category: 'Ceramics',
        modelPath: 'models/ancient-vase.glb',
        description: 'This ceramic vase reflects a ceremonial and domestic tradition from the early museum collection, shaped by careful craft and symbolic design.',
        background: 'The object was made during a period of artisanal production when vessels were both functional and meaningful in social rituals.',
        period: 'Late 19th century',
        material: 'Earthenware and glaze',
        facts: [
          'Hand-shaped craft with decorative surface treatment.',
          'Likely used for ceremonial or household display.',
          'A representative artifact of material culture and heritage.'
        ],
        tags: ['vase', 'ceramic', 'pottery', 'jar', 'artifact', 'ancient']
      },
      {
        id: 'historical-sword',
        name: 'Historical Sword',
        category: 'Weaponry',
        modelPath: 'models/historical-sword.glb',
        description: 'This sword is a historic weapon and ceremonial artifact associated with the heritage collection and the era of local martial traditions.',
        background: 'The piece represents material culture, status, and the martial history connected to the period it belongs to.',
        period: 'Early 20th century',
        material: 'Steel, leather, and brass fittings',
        facts: [
          'Blade construction suggests both practical and ceremonial use.',
          'Handles are styled to reflect historical craftsmanship.',
          'Typical of heritage objects preserved for public education.'
        ],
        tags: ['sword', 'blade', 'weapon', 'steel', 'historical', 'artifact']
      },
      {
        id: 'old-coin',
        name: 'Old Coin',
        category: 'Numismatics',
        modelPath: 'models/old-coin.glb',
        description: 'This coin reflects a historical era of trade, governance, and everyday circulation, preserving a visual record of national and local identity.',
        background: 'Numismatic objects such as this provide direct evidence of economy, authority, and cultural exchange across time.',
        period: 'Early 1900s',
        material: 'Bronze or alloy coin metal',
        facts: [
          'Minted for circulation and symbolic representation.',
          'Useful for studying historical economy and design.',
          'Small but highly informative artifact of public life.'
        ],
        tags: ['coin', 'currency', 'money', 'metal', 'numismatic', 'artifact']
      },
      {
        id: 'traditional-artifact',
        name: 'Traditional Artifact',
        category: 'Cultural Objects',
        modelPath: 'models/traditional-artifact.glb',
        description: 'This artifact represents the artistic and cultural values of tradition, preserved through technique, form, and symbolic meaning.',
        background: 'Traditional objects such as this connect the visitor to community memory, ritual custom, and material heritage.',
        period: 'Colonial to early republic period',
        material: 'Wood, textile, and carved detailing',
        facts: [
          'Shows craftsmanship rooted in tradition and heritage.',
          'Serves as a cultural marker of everyday life and identity.',
          'Intended to support interpretation and community learning.'
        ],
        tags: ['artifact', 'traditional', 'wood', 'heritage', 'craft', 'culture']
      }
    ],
    uploadedImages: [],
    exhibits: []
  };

  function cloneData(data) {
    return JSON.parse(JSON.stringify(data));
  }

  function loadDatabase() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultDatabase));
        return cloneData(defaultDatabase);
      }

      const parsed = JSON.parse(raw);
      return {
        supportedObjects: Array.isArray(parsed.supportedObjects) && parsed.supportedObjects.length ? parsed.supportedObjects : cloneData(defaultDatabase.supportedObjects),
        uploadedImages: Array.isArray(parsed.uploadedImages) ? parsed.uploadedImages : [],
        exhibits: Array.isArray(parsed.exhibits) ? parsed.exhibits : []
      };
    } catch (error) {
      console.warn('Unable to read object database, using defaults.', error);
      return cloneData(defaultDatabase);
    }
  }

  function saveDatabase(database) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(database));
  }

  function getSupportedObjects() {
    return loadDatabase().supportedObjects;
  }

  function matchSupportedObject(candidateText) {
    if (!candidateText) return null;

    const normalized = candidateText.toLowerCase();
    const objects = getSupportedObjects();

    return objects.find((item) => {
      const nameMatch = normalized.includes(item.name.toLowerCase());
      const tagMatch = item.tags.some((tag) => normalized.includes(tag.toLowerCase()));
      return nameMatch || tagMatch;
    }) || null;
  }

  function addUploadedImage(record) {
    const db = loadDatabase();
    const next = {
      id: record.id || `uploaded-${Date.now()}`,
      name: record.name || 'Uploaded Artifact',
      type: record.type || 'Uploaded image',
      exhibitId: record.exhibitId || null,
      markerId: record.markerId || null,
      imageData: record.imageData,
      matchedObjectId: record.matchedObjectId || null,
      description: record.description || '',
      createdAt: new Date().toISOString()
    };

    db.uploadedImages.unshift(next);
    saveDatabase(db);
    return next;
  }

  function getObjectById(objectId) {
    return getSupportedObjects().find((item) => item.id === objectId) || null;
  }

  // Exhibit management
  function getExhibits() {
    return loadDatabase().exhibits || [];
  }

  function saveExhibit(exhibit) {
    const db = loadDatabase();
    if (!Array.isArray(db.exhibits)) {
      db.exhibits = [];
    }
    
    const existingIdx = db.exhibits.findIndex(e => e.id === exhibit.id);
    if (existingIdx >= 0) {
      db.exhibits[existingIdx] = exhibit;
    } else {
      if (!exhibit.id) {
        exhibit.id = `exhibit-${Date.now()}`;
      }
      db.exhibits.unshift(exhibit);
    }
    
    saveDatabase(db);
    return exhibit;
  }

  function deleteExhibit(exhibitId) {
    const db = loadDatabase();
    db.exhibits = (db.exhibits || []).filter(e => e.id !== exhibitId);
    saveDatabase(db);
  }

  function getExhibitById(exhibitId) {
    return (getExhibits() || []).find(e => e.id === exhibitId) || null;
  }

  function getUploadedImages() {
    return loadDatabase().uploadedImages || [];
  }

  function deleteUploadedImage(imageId) {
    const db = loadDatabase();
    db.uploadedImages = (db.uploadedImages || []).filter(img => img.id !== imageId);
    saveDatabase(db);
  }

  window.objectDatabase = {
    STORAGE_KEY,
    loadDatabase,
    saveDatabase,
    getSupportedObjects,
    getObjectById,
    matchSupportedObject,
    addUploadedImage,
    getExhibits,
    saveExhibit,
    deleteExhibit,
    getExhibitById,
    getUploadedImages,
    deleteUploadedImage
  };
})();
