import { Language, create } from 'epic-language/native'
import { useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'

const { Text } = create(
  {
    title: 'My App',
    description: 'Automatically generate translations',
    changeLanguage: 'Change language',
  },
  {
    [Language.es]: {
      title: 'Mi aplicación',
      description: 'Generar traducciones automáticamente',
      changeLanguage: 'Cambiar idioma',
    },
    [Language.zh]: {
      title: '我的應用程式',
      description: '自动生成翻译',
      changeLanguage: '更改语言',
    },
  },
)

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 70,
    paddingBottom: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 50,
  },
  description: {
    fontSize: 15,
  },
})

const languages = [Language.en, Language.es, Language.zh]

export default function App() {
  const [currentLanguageIndex, setLanguageIndex] = useState(0)
  const currentLanguage = languages[currentLanguageIndex]

  const changeLanguage = () => {
    const nextIndex = (currentLanguageIndex + 1) % languages.length
    setLanguageIndex(nextIndex)
  }

  return (
    <View style={styles.screen}>
      <Text language={currentLanguage} style={styles.title}>
        title
      </Text>
      <Text language={currentLanguage} style={styles.description}>
        description
      </Text>
      <Pressable onPress={changeLanguage}>
        <Text language={currentLanguage}>changeLanguage</Text>
      </Pressable>
    </View>
  )
}
