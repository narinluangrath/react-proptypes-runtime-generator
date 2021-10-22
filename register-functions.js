import componentMap from './component-map';


function registerExports(defaultExport, namedExports, file) {
  const displayNames = componentMap[file].map(({ displayName }) => displayName);
  try {
    if (displayNames.includes(defaultExport.displayName)) {
      defaultExport.__filename = file;
      defaultExport.__exportPosition = 'default';
    }
    Object.keys(namedExports).sort().forEach((key, exportPosition) => {
      if (displayNames.includes(namedExports[key].displayName)) {
        namedExports[key].__filename = file;
        namedExports[key].__exportPosition = exportPosition;
      }
    });
  } catch (e) {
    console.warn('Failed to modify React component for tracking purposes');
    console.warn(e);
  }
}


