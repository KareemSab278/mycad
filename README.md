nothing here yet...

might decide to move with heroui. seems smarter but am worried about build size. seems worth it if the app looks good.

https://heroui.com/en/docs/native/components

all pages must have KeyboardAvoidingView if using keyboard above SafeAreaView:
<KeyboardAvoidingView behavior={keyboardAvoidingBehavior} style={{ flex: 1 }}>
<SafeAreaView style={{ flex: 1 }}>