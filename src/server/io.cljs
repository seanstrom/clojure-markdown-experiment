(ns server.io)

(defn file
  [file-path]
  (js/Bun.file file-path))

(defn file->text
  [file-obj]
  (.text file-obj))
