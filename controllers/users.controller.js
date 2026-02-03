import User from "../models/User.js";

export const getUsers = async (req, res) => {
  try {
    // ----> data received from app
    const { exclude = '', limit = '4', userSearch = '' } = req.query;

    // ----> verify limit number
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 4));

    // ----> transform in list element in `exclude`
    const excludeArr = exclude ? exclude.split(',').filter(Boolean) : [];

    // ----> create model to exclude
    const filter = {
      gender: { $in: ['Male', 'Female'] },
      ...(excludeArr.length ? { userID: { $nin: excludeArr } } : {})
    };

    // ----> add `name` details on filter
    if (userSearch && userSearch.trim() !== '') {
      filter.name = { $regex: userSearch.trim(), $options: 'i' };
    }

    // ----> exclude element server will show
    const projection = {
      _id: 0,
      userID: 1,
      name: 1,
      profileImage: 1,
      type: 1,
      gender: 1,
      createdAt: 1
    };

    // ----> 
    const docs = await User.find(filter)
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .select(projection)
      .lean(); 

    // ----> send data to app
    res.json({
      data: docs,
      count: docs.length,
      hasMore: docs.length === limitNum
    });
  } catch (err) {
    console.error('❌ profiles.search error', err);
    res.status(500).json({ error: '❌ Server error' });
  }
}