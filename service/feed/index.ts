export const getRawFeed = async (category: string) => {
  try {
    // Construct the dynamic import path
    const modulePath = `./${category}`;

    // Dynamically import the module
    const module = await import(modulePath);

    // Ensure getFeed function exists before calling
    if (typeof module.getRawFeed === "function") {
      return await module.getRawFeed();
    } else {
      console.log(
        "[SERVICE]",
        "[ERROR]",
        `getFeed function not found in ${modulePath}`
      );
    }
  } catch (error) {
    console.log(
      "[SERVICE]",
      "[ERROR]",
      `Error loading feed for category "${category}":`,
      error
    );
    return null;
  }
};

export const getFeed = async (category: string) => {
  try {
    // Construct the dynamic import path
    const modulePath = `./${category}`;

    // Dynamically import the module
    const module = await import(modulePath);

    // Ensure getFeed function exists before calling
    if (typeof module.getFeed === "function") {
      return await module.getFeed();
    } else {
      console.log(
        "[SERVICE]",
        "[ERROR]",
        `getFeed function not found in ${modulePath}`
      );
    }
  } catch (error) {
    console.log(
      "[SERVICE]",
      "[ERROR]",
      `Error loading feed for category "${category}":`,
      error
    );
    return null;
  }
};

export const sendFeed = async (
  channels: {
    channel: string;
    title: string;
  }[],
  feeds: Partial<Feed>[],
  botusername: string,
  category: string,
  enableTranslation: boolean = false,
  translationLanguage: string = "",
  googleApiKey: string = ""
) => {
  try {
    // Construct the dynamic import path
    const modulePath = `./${category}`;

    // Dynamically import the module
    const module = await import(modulePath);

    // Ensure getFeed function exists before calling
    if (typeof module.sendFeed === "function") {
      return await module.sendFeed(
        channels,
        feeds,
        botusername,
        enableTranslation,
        translationLanguage,
        googleApiKey
      );
    } else {
      throw new Error(`getFeed function not found in ${modulePath}`);
    }
  } catch (error) {
    console.error(`Error loading feed for category "${category}":`, error);
    return null;
  }
};
